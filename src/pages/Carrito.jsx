import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { getThumbnailUrl, handleImageError } from '../utils/tools.jsx'
import PropTypes from 'prop-types'

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to determine price based on quantity
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

  // Memoized function to fetch products
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

  // Memoized function to get cart items grouped by product and customizations
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

  // Function to handle removing items
  const handleRemove = useCallback(
    (productId, customizations) => {
      const updatedCart = cartItems.filter(
        item =>
          !(
            item.product === productId &&
            JSON.stringify(item.selectedCustomizations) ===
              JSON.stringify(customizations)
          )
      )

      localStorage.setItem('carrito', JSON.stringify(updatedCart))
      setCartItems(updatedCart)

      // Only remove product if no other items with same productId exist
      const shouldRemoveProduct = !updatedCart.some(
        item => item.product === productId
      )
      if (shouldRemoveProduct) {
        setProducts(prev => prev.filter(p => p._id !== productId))
      }
    },
    [cartItems]
  )

  // Function to get custom image
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

  // Function to update quantity
  const updateQuantity = useCallback(
    (productId, customizations, newQuantity) => {
      if (newQuantity < 1) return

      const updatedCart = cartItems.map(item => {
        if (
          item.product === productId &&
          JSON.stringify(item.selectedCustomizations) ===
            JSON.stringify(customizations)
        ) {
          return { ...item, quantity: newQuantity }
        }
        return item
      })

      localStorage.setItem('carrito', JSON.stringify(updatedCart))
      setCartItems(updatedCart)
    },
    [cartItems]
  )

  // Calculate total price
  const calculateTotal = useCallback(() => {
    return groupedCartItems.reduce((total, group) => {
      const product = products.find(p => p._id === group.product)
      if (!product) return total

      const unitPrice = getPriceForQuantity(product.price, group.totalQuantity)
      return total + unitPrice * group.totalQuantity
    }, 0)
  }, [groupedCartItems, products, getPriceForQuantity])

  // Calculate total items count
  const totalItemsCount = useMemo(() => {
    return groupedCartItems.reduce((sum, group) => sum + group.totalQuantity, 0)
  }, [groupedCartItems])

  if (isLoading) {
    return (
      <div className='container my-4 text-center'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <p>Loading your cart...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container my-4'>
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
        <button
          className='btn btn-primary'
          onClick={() => fetchProducts(cartItems)}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='container my-4'>
      <h2 className='mb-4'>Tu carrito</h2>

      {cartItems.length === 0 ? (
        <div className='text-center py-5'>
          <i className='bi bi-cart-x fs-1 text-muted'></i>
          <p className='fs-5 mt-3'>Your cart is empty</p>
          <a href='/' className='btn btn-primary mt-2'>
            Seguir comprando
          </a>
        </div>
      ) : (
        <>
          <div className='row'>
            <div className='col-lg-8'>
              {groupedCartItems.map(group => {
                const product = products.find(p => p._id === group.product)
                if (!product) return null

                const { selectedCustomizations, totalQuantity } = group
                const displayImage = getCustomImage(
                  product,
                  selectedCustomizations
                )
                const unitPrice = getPriceForQuantity(
                  product.price,
                  totalQuantity
                )
                const subtotal = unitPrice * totalQuantity

                // Get all available quantity tiers for this product
                const quantityTiers = product.price || []

                return (
                  <div
                    key={`${product._id}-${JSON.stringify(
                      selectedCustomizations
                    )}`}
                    className='card mb-3 bg-transparent border-0'
                  >
                    <hr />
                    <div className='row g-0'>
                      <div className='col-md-4'>
                        <img
                          src={getThumbnailUrl(displayImage)}
                          className='img-fluid rounded-start'
                          onError={handleImageError}
                          alt={product.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className='col-md-8'>
                        <div className='card-body'>
                          <div className='d-flex justify-content-between'>
                            <h5 className='card-title'>{product.name}</h5>
                            <button
                              className='btn btn-outline-danger btn-sm'
                              onClick={() =>
                                handleRemove(
                                  product._id,
                                  selectedCustomizations
                                )
                              }
                              aria-label={`Remove ${product.name} from cart`}
                            >
                              <i className='bi bi-trash'></i>
                            </button>
                          </div>
                          <p className='card-text text-muted'>
                            {product.description}
                          </p>

                          {/* Display price information */}
                          <div className='mb-2'>
                            <p className='mb-1'>
                              <strong>Precio unitario:</strong> $
                              {unitPrice.toFixed(2)}
                              {quantityTiers.length > 1 && (
                                <span className='text-muted ms-2'>
                                  (
                                  {totalQuantity <
                                  parseInt(
                                    quantityTiers[0].quantity.split('-')[0]
                                  )
                                    ? `Order ${
                                        parseInt(
                                          quantityTiers[0].quantity.split(
                                            '-'
                                          )[0]
                                        ) - totalQuantity
                                      } more for discount`
                                    : `Mayoreo aplicado`}
                                  )
                                </span>
                              )}
                            </p>

                            {/* Show quantity tiers if available */}
                            {quantityTiers.length > 1 && (
                              <div className='mt-2'>
                                <small className='text-muted'>Precios:</small>
                                <ul className='list-unstyled small'>
                                  {quantityTiers.map((tier, index) => (
                                    <li key={index}>
                                      {tier.quantity} unidades: $
                                      {tier.price.toFixed(2)} c/u
                                      {totalQuantity >=
                                        parseInt(tier.quantity.split('-')[0]) &&
                                        (!tier.quantity.includes('-') ||
                                          totalQuantity <=
                                            parseInt(
                                              tier.quantity.split('-')[1]
                                            )) && (
                                          <span className='badge bg-success ms-2'>
                                            Ap licado
                                          </span>
                                        )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className='d-flex align-items-center mb-2'>
                            <span className='me-2'>Cantidad:</span>
                            <button
                              className='btn btn-outline-secondary btn-sm'
                              onClick={() =>
                                updateQuantity(
                                  product._id,
                                  selectedCustomizations,
                                  totalQuantity - 1
                                )
                              }
                              disabled={totalQuantity <= 1}
                            >
                              -
                            </button>
                            <span className='mx-2'>{totalQuantity}</span>
                            <button
                              className='btn btn-outline-secondary btn-sm'
                              onClick={() =>
                                updateQuantity(
                                  product._id,
                                  selectedCustomizations,
                                  totalQuantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          {selectedCustomizations &&
                            Object.keys(selectedCustomizations).length > 0 && (
                              <div className='mt-2'>
                                <h6 className='mb-2'>Personalizacion:</h6>
                                <ul className='list-unstyled'>
                                  {Object.entries(selectedCustomizations).map(
                                    ([key, val], i) => (
                                      <li key={i}>
                                        <small>
                                          {key}: <strong>{val}</strong>
                                        </small>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                          <p className='card-text mt-2'>
                            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='col-lg-4'>
              <div className='card shadow'>
                <div className='card-body'>
                  <h5 className='card-title'>Resumen</h5>
                  <hr />
                  <div className='d-flex justify-content-between mb-2'>
                    {/* <span>Subtotal ({totalItemsCount} items):</span> */}
                    <span>Subtotal:</span>

                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className='d-flex justify-content-between mb-3'>
                    <span>Envio:</span>
                    <span className='text-success'>Gratis</span>
                  </div>
                  <hr />
                  <div className='d-flex justify-content-between fw-bold fs-5'>
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button className='btn btn-primary w-100 mt-3'>
                    Realizar orden
                  </button>
                  <a
                    href='/products'
                    className='btn btn-outline-info w-100 mt-2'
                  >
                    Seguir comprando
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

ShoppingCart.propTypes = {
  // Add prop types if this component receives any props
}

export default ShoppingCart
