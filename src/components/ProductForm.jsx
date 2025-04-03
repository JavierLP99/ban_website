/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Modal, Button } from 'react-bootstrap'
import slugify from 'slugify'
import ProductCard from '../components/ProductCard'
import ImageUploader from './ImageUploader'
import { useParams } from 'react-router-dom'

import axios from 'axios'

const schema = yup
  .object({
    name: yup.string().required('Nombre del producto es obligatorio'),
    slug: yup.string().required('El slug es obligatorio'),
    description: yup.string().required('Descripción requerida'),
    category: yup.string().required('Selecciona una categoría'),
    season: yup.string().required('Selecciona una temporada'),
    prices: yup.array().of(
      yup.object({
        price: yup
          .number()
          .required('Precio es obligatorio')
          .positive('El precio debe ser positivo')
          .typeError('El precio debe ser un número'),
        minQty: yup
          .number()
          .required('Cantidad mínima es obligatoria')
          .min(0, 'La cantidad mínima debe ser 0 o mayor')
          .typeError('La cantidad mínima debe ser un número'),
        maxQty: yup
          .number()
          .required('Cantidad máxima es obligatoria')
          .min(
            yup.ref('minQty'),
            'La cantidad máxima debe ser mayor o igual a la mínima'
          )
          .typeError('La cantidad máxima debe ser un número')
      })
    ),

    customizations: yup
      .array()
      .of(
        yup.object({
          name: yup
            .string()
            .required('Nombre de personalización es obligatorio'),
          type: yup
            .string()
            .required('Tipo de personalización es obligatorio')
            .oneOf(
              ['text', 'file', 'enum'],
              'Tipo debe ser uno de los siguientes: texto, archivo, lista'
            ),
          description: yup
            .string()
            .required('Descripción de personalización es obligatoria'),
          options: yup
            .string()
            .nullable()
            .when('type', {
              is: 'enum',
              then: schema =>
                schema.required(
                  'Las opciones son obligatorias para tipo lista'
                ),
              otherwise: schema => schema.notRequired().nullable()
            })
        })
      )
      .default([]) // Ensures it doesn't break when empty
  })
  .required()

// eslint-disable-next-line no-unused-vars
const ProductDescription = ({ productId }) => {
  const { id } = useParams() // Get product ID from URL

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setValue,
    formState: { errors }
    // reset
  } = useForm({ resolver: yupResolver(schema) })

  const [categories, setCategories] = useState(['Ropa', 'Tazas'])
  const [seasons, setSeasons] = useState(['Día de Muertos', '14 de Febrero'])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSeasonModal, setShowSeasonModal] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newSeason, setNewSeason] = useState('')
  const [prices, setPrices] = useState([
    { id: Date.now(), price: '', minQty: '', maxQty: '' }
  ])
  const [customizations, setCustomizations] = useState([
    { id: Date.now(), name: '', type: '', description: '', options: '' }
  ])

  const fetchCategories = async () => {
      axios
        .get(`https://banannylandapp.onrender.com/categories`, {
          params: {
            limit: 100
          }
        })
        .then(response => {
          console.log('API Response:', response.data)
          setCategories(response.data.categories.map(category => category.name))

        })
        .catch(error => console.error('Error fetching products:', error))
        axios
        .get(`https://banannylandapp.onrender.com/tags`, {
          params: {
            limit: 100
          }
        })
        .then(response => {
          console.log('API Response:', response.data)
          setSeasons(response.data.tags.map(tag => tag.name))

        })
        .catch(error => console.error('Error fetching products:', error))
    }

    

  useEffect(() => {
    fetchCategories()
    if (id) {
      axios
        .get(`https://banannylandapp.onrender.com/products/${id}`)
        .then(response => {
          const product = response.data.product
          console.log(response)

          setValue('name', product.name)
          setValue('slug', product.slug)
          setValue('description', product.description)
          setValue('category', product.category)
          setValue('tags', product.tags || [])
          setSelectedImages(product.images || [])

          // Format Prices Correctly
          const formattedPrices = product.price.map((p, index) => ({
            id: index,
            price: p.price,
            minQty: parseInt(p.quantity.split('-')[0], 10),
            maxQty: parseInt(p.quantity.split('-')[1], 10)
          }))
          setPrices(formattedPrices)
          setValue('prices', formattedPrices) // ✅ Ensure React Hook Form recognizes it

          // Format Customizations Correctly
          const formattedCustomizations = product.customizationOptions.map(
            (custom, index) => ({
              id: index,
              name: custom.name,
              type: custom.type,
              description: custom.description,
              options: Array.isArray(custom.options)
                ? custom.options.join(', ')
                : custom.options || '' // ✅ Convert array to string
            })
          )
          setCustomizations(formattedCustomizations)
          setValue('customizations', formattedCustomizations) // ✅ Ensure React Hook Form recognizes it
        })
        .catch(error => console.error('Error fetching product:', error))
    }
  }, [id, setValue])

  

  //Gallery

  const [showModal, setShowModal] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])

  const handleImageSelect = images => {
    setValue('images', images)
    setSelectedImages(images)
    setShowModal(false)
  }

  useEffect(() => {
    setValue('slug', slugify(watch('name') || '', { lower: true }))
  }, [watch('name'), setValue])

  const addPriceRow = () => {
    setPrices([
      ...prices,
      { id: Date.now(), price: '', minQty: '', maxQty: '' }
    ])
  }

  const addCustomizationRow = () => {
    setCustomizations([
      ...customizations,
      { id: Date.now(), name: '', type: '', description: '', options: '' }
    ])
  }

  const addNewCategory = () => {
    if (newCategory) {
      setCategories([...categories, newCategory])
      setNewCategory('')
      setShowCategoryModal(false)
    }
  }

  const addNewSeason = () => {
    if (newSeason) {
      setSeasons([...seasons, newSeason])
      setNewSeason('')
      setShowSeasonModal(false)
    }
  }

  const removePriceRow = index => {
    setPrices(prices.filter((_, i) => i !== index))
  }

  const removeCustomizationRow = index => {
    setCustomizations(customizations.filter((_, i) => i !== index))
  }

  const [message, setMessage] = useState(null) // State for feedback message
  const [messageType, setMessageType] = useState(null) // "success" or "error"

  const onSubmit = async data => {
    setMessage(null) // Clear previous messages
    setMessage('Cargando.')
    setMessageType('info')

    const formattedPrices = prices.map(price => ({
      quantity: `${price.minQty}-${price.maxQty}`,
      customizations: [],
      price: Number(price.price)
    }))

    const formattedCustomizations = customizations.map(custom => ({
      name: custom.name,
      type: custom.type,
      description: custom.description,
      options: custom.options ? custom.options.split(',') : []  // Split string into array
    }))

    const fullData = {
      ...data,
      price: formattedPrices,
      customizationOptions: formattedCustomizations,
      tags: [data.season],
      images: selectedImages
    }

    delete fullData.season
    delete fullData.customizations
    delete fullData.prices

    try {
      if (id) {
        await axios.put(
          `https://banannylandapp.onrender.com/products/${id}`,
          fullData
        )
        console.log(fullData)
        setMessage('Producto actualizado exitosamente.')
        setMessageType('success')
      } else {
        await axios.post(
          'https://banannylandapp.onrender.com/products',
          fullData
        )
        setMessage('Producto creado exitosamente.')
        setMessageType('success')
      }
    } catch (error) {
      setMessage('Hubo un error al guardar el producto. Inténtalo de nuevo.')
      setMessageType('error')
      console.error('Error saving product:', error)
    }
  }

  // Function to handle type change and enable options field
  const handleTypeChange = (index, type) => {
    const newCustomizations = [...customizations]
    newCustomizations[index].type = type
    // Enable/disable options input based on type
    if (type !== 'enum') {
      newCustomizations[index].options = '' // Clear options if it's not 'enum'
    }
    setCustomizations(newCustomizations)
  }

  return (
    <div className='container my-4'>
      <h1>Editar producto</h1>
      <div className='row d-flex'>
        <div className='col-12 col-lg-8 px-3'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='d-flex flex-column'
          >
            <label>Nombre del Producto</label>
            <input {...register('name')} className='form-control mb-2' />
            <p className='text-danger'>{errors.name?.message}</p>

            <div className='d-flex flex-column col-12'>
              <label>Slug</label>
              <input
                {...register('slug')}
                readOnly
                className='my-2 p-2 border bg-light'
              />
            </div>

            <label>Descripción</label>
            <textarea
              {...register('description')}
              className='form-control mb-2'
              rows='3'
            ></textarea>
            <p className='text-danger'>{errors.description?.message}</p>

            <div className='d-flex row'>
              <div className='col-6'>
                <label>Categoría</label>
                <div className='row px-2'>
                  <div className='col-8'>
                    <select {...register('category')} className='form-control'>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowCategoryModal(true)}
                    className='col-4 btn btn-dark'
                  >
                    Nueva
                  </button>
                </div>
              </div>

              <div className='col-6 px-2'>
                <label>Temporada</label>
                <div className='row px-2'>
                  <div className='col-8'>
                    <select {...register('season')} className='form-control'>
                      {seasons.map((season, index) => (
                        <option key={index} value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowSeasonModal(true)}
                    className='col-4 btn btn-dark'
                  >
                    Nueva
                  </button>
                </div>
              </div>
            </div>

            <h5 className='mt-4'>Precios</h5>
            <div className='row fw-bold d-none d-lg-flex'>
              <div className='col-4'>Precio</div>
              <div className='col-4'>Cantidad Mínima</div>
              <div className='col-4'>Cantidad Máxima</div>
            </div>
            {prices.map((price, index) => (
              <div key={price.id} className='row mb-2'>
                <div className='col-12 col-lg-3 p-0 position-relative'>
                  <div className='input-group column'>
                    <span className='input-group-text d-lg-none w-25 justify-content-center'>
                      ${' '}
                    </span>
                    <input
                      className='col-4 form-control text-center'
                      {...register(`prices.${index}.price`)}
                      placeholder='$'
                      value={price.price || ''} // Default to empty string if undefined
                      onChange={e => {
                        // Clear the error on modification
                        clearErrors(`prices.${index}.price`)
                        const newPrices = [...prices]
                        newPrices[index].price = e.target.value
                        setPrices(newPrices)
                        setValue(`prices.${index}.price`, e.target.value) // Sync with react-hook-form
                      }}
                    />
                  </div>

                  {/* Error Exclamation Mark */}
                  {errors.prices?.[index]?.price && (
                    <div className='floating-error-container'>
                      <span className='error-icon'>!</span>
                      <span className='error-tooltip'>
                        {errors.prices[index].price.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className='col-12 col-lg-4 p-0 position-relative'>
                  <div className='input-group column'>
                    <span className='input-group-text d-lg-none w-25 justify-content-center'>
                      Min{' '}
                    </span>
                    <input
                      className='col-4 form-control text-center'
                      {...register(`prices.${index}.minQty`)}
                      placeholder='Min'
                      value={price.minQty || ''} // Default to empty string if undefined
                      onChange={e => {
                        // Clear the error on modification
                        clearErrors(`prices.${index}.minQty`)
                        const newPrices = [...prices]
                        newPrices[index].minQty = e.target.value
                        setPrices(newPrices)
                        setValue(`prices.${index}.minQty`, e.target.value) // Sync with react-hook-form
                      }}
                    />
                  </div>
                  {errors.prices?.[index]?.minQty && (
                    <div className='floating-error-container'>
                      <span className='error-icon'>!</span>
                      <span className='error-tooltip'>
                        {errors.prices[index].minQty.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className='col-12 col-lg-4 p-0 position-relative'>
                  <div className='input-group column'>
                    <span className='input-group-text d-lg-none w-25 justify-content-center'>
                      Max{' '}
                    </span>
                    <input
                      className='col-4 form-control text-center'
                      {...register(`prices.${index}.maxQty`)}
                      placeholder='Max'
                      value={price.maxQty || ''} // Default to empty string if undefined
                      onChange={e => {
                        // Clear the error on modification
                        clearErrors(`prices.${index}.maxQty`)
                        const newPrices = [...prices]
                        newPrices[index].maxQty = e.target.value
                        setPrices(newPrices)
                        setValue(`prices.${index}.maxQty`, e.target.value) // Sync with react-hook-form
                      }}
                    />
                  </div>
                  {errors.prices?.[index]?.maxQty && (
                    <div className='floating-error-container'>
                      <span className='error-icon'>!</span>
                      <span className='error-tooltip'>
                        {errors.prices[index].maxQty.message}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type='button'
                  className='btn btn-danger col-12 col-lg-1'
                  onClick={() => removePriceRow(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              type='button'
              className='btn btn-primary'
              onClick={addPriceRow}
            >
              +
            </button>

            <h5 className='mt-4'>Personalización</h5>
            <div className='row fw-bold'>
              <div className='col-3 text-center'>Nombre</div>
              <div className='col-2 text-center'>Tipo</div>
              <div className='col-4 text-center'>Descripción</div>
              <div className='col-3 text-center'>Opciones</div>
            </div>
            {customizations.map((custom, index) => (
              <div key={custom.id} className='row mb-2 d-flex'>
                <div className='col-12 col-lg-3 p-0 position-relative'>
                  <div className='input-group column'>
                    <span className='input-group-text d-lg-none w-25 justify-content-center'>
                      Nombre{' '}
                    </span>
                    <input
                      className='col-4 form-control text-start'
                      {...register(`customizations.${index}.name`)}
                      placeholder='Nombre'
                      value={custom.name || ''} // Default to empty string if undefined
                      onChange={e => {
                        clearErrors(`customizations.${index}.name`)
                        const newCustomizations = [...customizations]
                        newCustomizations[index].name = e.target.value
                        setCustomizations(newCustomizations)
                        setValue(`customizations.${index}.name`, e.target.value)
                      }}
                    />
                  </div>

                  {/* Error Exclamation Mark */}
                  {errors.customizations?.[index]?.name && (
                    <div className='floating-error-container'>
                      <span className='error-icon'>!</span>
                      <span className='error-tooltip'>
                        {errors.customizations[index].name.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className='col-12 col-lg-2 p-0 position-relative'>
                  <div className='input-group column'>
                    <span className='input-group-text d-lg-none w-25 justify-content-center'>
                      Tipo{' '}
                    </span>
                    <select
                      className='form-control'
                      {...register(`customizations.${index}.type`)}
                      value={custom.type}
                      onChange={e => {
                        clearErrors(`customizations.${index}.type`)
                        handleTypeChange(index, e.target.value)
                        const newCustomizations = [...customizations]
                        newCustomizations[index].type = e.target.value
                        setCustomizations(newCustomizations)
                        setValue(`customizations.${index}.type`, e.target.value)
                      }}
                    >
                      <option value=''></option>
                      <option value='text'>Texto</option>
                      <option value='file'>Archivo</option>
                      <option value='enum'>Lista</option>
                    </select>
                  </div>

                  {/* Error Exclamation Mark */}
                  {errors.customizations?.[index]?.type && (
                    <div className='floating-error-container'>
                      <span className='error-icon'>!</span>
                      <span className='error-tooltip'>
                        {errors.customizations[index].type.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className='col-12 col-lg-3 p-0 position-relative'>
                  <div className='input-group column'>
                    <span className='input-group-text d-lg-none w-25 justify-content-center'>
                      Descripcion{' '}
                    </span>
                    <input
                      className='col-4 form-control text-start'
                      {...register(`customizations.${index}.description`)}
                      placeholder='Descripción'
                      value={custom.description || ''} // Default to empty string if undefined
                      onChange={e => {
                        clearErrors(`customizations.${index}.description`)
                        const newCustomizations = [...customizations]
                        newCustomizations[index].description = e.target.value
                        setCustomizations(newCustomizations)
                        setValue(
                          `customizations.${index}.description`,
                          e.target.value
                        )
                      }}
                    />
                  </div>

                  {/* Error Exclamation Mark */}
                  {errors.customizations?.[index]?.description && (
                    <div className='floating-error-container'>
                      <span className='error-icon'>!</span>
                      <span className='error-tooltip'>
                        {errors.customizations[index].description.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className='col-12 col-lg-3 p-0 position-relative'>
                  <div className='input-group column'>
                    <span className='input-group-text d-lg-none w-25 justify-content-center'>
                      Opciones{' '}
                    </span>
                    <input
                      className='form-control'
                      {...register(`customizations.${index}.options`)}
                      placeholder='Opciones'
                      value={custom.options}
                      onChange={e => {
                        clearErrors(`customizations.${index}.options`)
                        const newCustomizations = [...customizations]
                        newCustomizations[index].options = e.target.value
                        setCustomizations(newCustomizations)
                        setValue(
                          `customizations.${index}.options`,
                          e.target.value
                        )
                      }}
                      disabled={custom.type !== 'enum'}
                    />
                  </div>

                  {/* Error Exclamation Mark */}
                  {errors.customizations?.[index]?.options && (
                    <div className='floating-error-container'>
                      <span className='error-icon'>!</span>
                      <span className='error-tooltip'>
                        {errors.customizations[index].options.message}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type='button'
                  className='btn btn-danger col-12 col-lg-1'
                  onClick={() => removeCustomizationRow(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              type='button'
              className='btn btn-primary'
              onClick={addCustomizationRow}
            >
              +
            </button>

            <div className='my-3'>
              <h2 className='h5 py-2'>Imágenes</h2>
              <button
                className='btn btn-primary mb-3'
                onClick={() => setShowModal(true)}
                type='button'
              >
                Seleccionar imágenes
              </button>

              {/* Display Selected Images */}
              <div className='row'>
                {selectedImages.map((url, index) => (
                  <div key={index} className='col-md-4 mb-3'>
                    <div className='card'>
                      <div className='ratio ratio-1x1'>
                        <img
                          src={url}
                          className='card-img-top object-fit-cover'
                          alt='Selected'
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ImageUploader Modal */}
              <ImageUploader
                onImageSelect={handleImageSelect}
                showModal={showModal}
                onCloseModal={() => setShowModal(false)}
                imageTag='gallery' // Change this to match your Cloudinary tag
              />
            </div>

            {message && (
              <div
                className={`alert ${
                  messageType === 'success'
                    ? 'alert-success'
                    : messageType === 'info'
                    ? 'alert-info'
                    : 'alert-danger'
                }`}
                role='alert'
              >
                {message}
              </div>
            )}
            <button type='submit' className='btn btn-success mt-3'>
              Guardar Producto
            </button>
          </form>

          {/* Modal for Adding Category */}
          <Modal
            show={showCategoryModal}
            onHide={() => setShowCategoryModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Agregar Nueva Categoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type='text'
                className='form-control'
                placeholder='Nueva categoría'
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant='secondary'
                onClick={() => setShowCategoryModal(false)}
              >
                Cancelar
              </Button>
              <Button variant='primary' onClick={addNewCategory}>
                Agregar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal for Adding Season */}
          <Modal
            show={showSeasonModal}
            onHide={() => setShowSeasonModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Agregar Nueva Temporada</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type='text'
                className='form-control'
                placeholder='Nueva temporada'
                value={newSeason}
                onChange={e => setNewSeason(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant='secondary'
                onClick={() => setShowSeasonModal(false)}
              >
                Cancelar
              </Button>
              <Button variant='primary' onClick={addNewSeason}>
                Agregar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className='col-4'>
          <ProductCard
            className='col-12'
            product={{
              name: watch('name'),
              category: watch('category'),
              slug: watch('slug'),
              referencePrice: watch('prices')?.[0]?.price ?? 0,
              images: selectedImages,
              tags: [watch('season')]
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductDescription
