/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getThumbnailUrl, handleImageError } from '../utils/tools.jsx'
import { getResizedCloudinaryUrl } from '../utils/tools'
import { Modal, Button } from 'react-bootstrap'
import emailjs from '@emailjs/browser'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const OrderSummary = () => {
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => setShowModal(false)
  const schema = yup
    .object({
      name: yup.string().required('Ingesa tu nombre'),
      phone: yup.string(),
      email: yup.string().required('Ingesa un email para contactarte'),
      message: yup.string().required('Escribe tu mensaje')
    })
    .required()
  const form = useRef()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) })

  const whenSubmit = data => {
    emailjs
      .sendForm(
        'service_d6s5ar5',
        'template_awatiom',
        form.current,
        'XRcANWSPimH7Fxmnv'
      )
      .then(
        () => {
          console.log('SUCCESS!')
        },
        error => {
          console.log('FAILED...', error.text)
        }
      )
    setShowModal(true)
  }

  const getPriceForQuantity = useCallback((priceTiers, quantity) => {
    if (!priceTiers || priceTiers.length === 0) return 0

    // Sort tiers by minimum quantity (just in case they're not in order)
    const sortedTiers = [...priceTiers].sort((a, b) => {
      const aMin = parseInt(a.quantity.split('-')[0])
      const bMin = parseInt(b.quantity.split('-')[0])
      return aMin - bMin
    })

    // Find the appropriate tier (default to last tier if quantity exceeds all ranges)
    const matchingTier =
      sortedTiers.find(tier => {
        const [min, max] = tier.quantity.split('-').map(Number)
        return quantity >= min && (max ? quantity <= max : true)
      }) || sortedTiers[sortedTiers.length - 1]

    return matchingTier?.price || 0
  }, [])

  const fetchProducts = useCallback(async carrito => {
    setIsLoading(true)
    setError(null)

    try {
      const uniqueProductIds = [...new Set(carrito.map(item => item.product))]
      const requests = uniqueProductIds.map(id =>
        axios.get(`https://banannylandapp.onrender.com/products/${id}`)
      )
      const responses = await Promise.all(requests)
      setProducts(responses.map(r => r.data.product))
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || []
    setCartItems(carrito)

    if (carrito.length > 0) {
      fetchProducts(carrito)
    }
  }, [fetchProducts])

  const groupedCartItems = useMemo(() => {
    const groups = {}

    cartItems.forEach(item => {
      const key = `${item.product}-${JSON.stringify(
        item.selectedCustomizations
      )}`
      if (!groups[key]) {
        groups[key] = {
          ...item,
          totalQuantity: 0
        }
      }
      groups[key].totalQuantity += item.quantity
    })

    return Object.values(groups)
  }, [cartItems])

  const getCustomImage = useCallback((product, customizations) => {
    if (!customizations || Object.keys(customizations).length === 0) {
      return product.images[0]
    }

    const matchedEntry = product.customizationImageMap?.find(entry => {
      return Object.entries(entry.combination).every(
        ([key, val]) => customizations[key]?.trim() === val.trim()
      )
    })
    return matchedEntry?.imageUrls[0] || product.images[0]
  }, [])

  const calculateTotal = useCallback(() => {
    return groupedCartItems.reduce((total, group) => {
      const product = products.find(p => p._id === group.product)
      if (!product) return total

      const unitPrice = getPriceForQuantity(product.price, group.totalQuantity)
      return total + unitPrice * group.totalQuantity
    }, 0)
  }, [groupedCartItems, products, getPriceForQuantity])

  return (
    <div className='container my-4'>
      <h2 className='mb-4'>Resumen de tu pedido</h2>
      <form className='row' ref={form} onSubmit={handleSubmit(whenSubmit)}>
        <div className='col-6'>
          <div className='mt-4'>
            <h6>Ingresa tus datos para contactarte</h6>
            <div className='d-flex flex-column col-8'>
              <label htmlFor='name'>Nombre</label>
              <input
                type='text'
                name='name'
                placeholder='nombre'
                id='name'
                {...register('name')}
                className='my-2 p-2 border border-2'
              />
              <p className='text-warning text-center'>{errors.name?.message}</p>
            </div>

            <div className='d-flex flex-column col-8'>
              <label htmlFor='email'>Correo</label>
              <input
                type='text'
                name='email'
                placeholder='correo@mail.com'
                id='email'
                {...register('email')}
                className='my-2 p-2 border border-2'
              />
              <p className='text-warning text-center'>
                {errors.email?.message}
              </p>
            </div>

            <div className='d-flex flex-column col-8'>
              <label htmlFor='phone'>Teléfono</label>
              <input
                type='text'
                name='phone'
                placeholder='55 1234 5678'
                id='phone'
                {...register('phone')}
                className='my-2 p-2 border border-2'
              />
              <p className='text-warning text-center'>
                {errors.phone?.message}
              </p>
            </div>
          </div>
          <div className='mt-4'>
            <h6>Método de contacto preferido</h6>
            <p>Los detalles y el seguimiento de tu pedido se enviarán al método de contacto que hayas seleccionado</p>
            <table className='row table align-middle mt-4'>
              <tbody>
                <tr>
                  <th scope='row'>
                    <input
                      className='form-check-input border-dark'
                      type='radio'
                      name='radioDefault'
                      id='radioDefault1'
                    />
                  </th>
                  <td>WhatsApp</td>
                </tr>
                <tr>
                  <th scope='row'>
                    <input
                      className='form-check-input border-dark'
                      type='radio'
                      name='radioDefault'
                      id='radioDefault1'
                    />
                  </th>
                  <td>Correo elctrónico</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='mt-4'>
            <h6>Selecciona el tipo de entrega</h6>
            <table className='row table align-middle mt-4'>
              <tbody>
                <tr>
                  <th scope='row'>
                    <input
                      className='form-check-input border-dark'
                      type='radio'
                      name='radioDefault'
                      id='radioDefault1'
                    />
                  </th>
                  <td>Entrega a domicilio</td>
                </tr>
                <tr>
                  <th scope='row'>
                    <input
                      className='form-check-input border-dark'
                      type='radio'
                      name='radioDefault'
                      id='radioDefault1'
                    />
                  </th>
                  <td>Recoger producto en puerta</td>
                </tr>
                <tr>
                  <th scope='row'>
                    <input
                      className='form-check-input border-dark'
                      type='radio'
                      name='radioDefault'
                      id='radioDefault2'
                    />
                  </th>
                  <td>Entrega en estación del metro</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='col-6'>
          {groupedCartItems.map(group => {
            const product = products.find(p => p._id === group.product)
            if (!product) return null

            const { selectedCustomizations, totalQuantity } = group
            const displayImage = getCustomImage(product, selectedCustomizations)
            const unitPrice = getPriceForQuantity(product.price, totalQuantity)
            const subtotal = unitPrice * totalQuantity

            return (
              <div
                key={`${product._id}-${JSON.stringify(selectedCustomizations)}`}
                className='card mb-3 bg-transparent border-0'
              >
                <div className='row'>
                  <div className='col-2'>
                    <img
                      src={getThumbnailUrl(displayImage)}
                      className='img-fluid col-12'
                      onError={handleImageError}
                      alt={product.name}
                    />
                  </div>
                  <div className='col-md-10'>
                    <div className='card-body'>
                      <h5 className='card-title'>{product.name}</h5>
                      <div className='d-flex justify-content-between'>
                        <p className='card-text text-muted'>
                          {product.description}
                        </p>
                      </div>
                      <div className='d-flex justify-content-between'>
                        <div className='mb-2'>
                          <p className='card-text mt-2'>
                            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className='d-flex justify-content-between'>
                        <div className='d-flex align-items-center mb-2'>
                          <span className='me-2'>Cantidad:</span>
                          <span className='mx-2'>{totalQuantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div className='d-flex justify-content-between fw-bold mb-3'>
            <span>Envio:</span>
            <span className='text-success'>
              Dependiendo del tipo de entrega
            </span>
          </div>
          <div className='d-flex justify-content-between fw-bold fs-5'>
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className='d-flex justify-content-center'>
            <button className='btn btn-primary mt-3' type='submit'>
              Realizar pedido
            </button>
          </div>
        </div>
      </form>
      <button
        className='btn btn-secondary'
        onClick={() => navigate('/carrito')}
      >
        <i className='bi bi-cart3 me-1'></i>Regresar al Carrito
      </button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center'>¡Tu pedido se ha realizado con éxito!</h2>
          <p className='text-center'>
            Revisa tu correo para ver la información de tu pedido
          </p>

          <div className='text-center mt-4'>
            <Button variant='dark' onClick={handleCloseModal}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default OrderSummary
