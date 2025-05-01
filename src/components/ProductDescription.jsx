import React, { useState, useEffect } from 'react'
import {
  getThumbnailUrl,
  getSquarePreviewUrl,
  getOptimizedImageUrl,
  handleImageError
} from '../utils/tools.jsx'
import axios from 'axios'
// import Reviews from './Reviews';

const ProductDescription = ({ productName }) => {
  const [product, setProduct] = useState(null)
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [showModal, setShowModal] = useState(false) // State to control modal visibility
  const [limits, setLimits] = useState([1, 1000])
  const [selectedCustomizations, setSelectedCustomizations] = useState({})

  const [message, setMessage] = useState(null) // State for feedback message
  const [messageType, setMessageType] = useState(null) // "success" or "error"
  useEffect(() => {
    // Fetch product from API based on productName
    axios
      .get(`https://banannylandapp.onrender.com/products/${productName}`)
      .then(response => {
        console.log(response)
        const fetchedProduct = response.data.product // Assuming the API returns an array
        setProduct(fetchedProduct)

        const initialSelections = {};

        product.customizationOptions.forEach(option => {
          if (option.options.length > 0) {
            initialSelections[option.name] = option.options[0].trim();
          }
        });
        setSelectedCustomizations(initialSelections);
      })
      .catch(error => console.error('Error loading product:', error))
  }, [productName])

  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]) // Set initial main image
      setPrice(product.price[0].price) // Set initial price based on quantity
      const limits = product.price.reduce(
        ([minSoFar, maxSoFar], p) => {
          const [min, max] = p.quantity.split('-').map(Number)
          return [Math.min(minSoFar, min), Math.max(maxSoFar, max)]
        },
        [Infinity, -Infinity]
      )
      setLimits(limits)
    }
  }, [product])


  useEffect(() => {
    if (!product || !product.images.length) return
    console.log(selectedCustomizations)

    const matchedImageEntry = product.customizationImageMap.find(entry => {
      const combination = entry.combination
      return Object.entries(combination).every(
        ([key, value]) => selectedCustomizations[key]?.trim() === value.trim()
      )
    })

    if (matchedImageEntry && matchedImageEntry.imageUrls.length > 0) {
      setMainImage(matchedImageEntry.imageUrls[0])
    }
  }, [selectedCustomizations, product])

  const handleThumbnailClick = image => {
    setMainImage(image)
  }

  const handleQuantityChange = e => {
    const newQuantity = e.target.value
    setQuantity(newQuantity)

    // Find the appropriate price tier based on quantity
    const priceTier = product.price.find(p => {
      const [min, max] = p.quantity.split('-').map(Number)
      return newQuantity >= min && newQuantity <= max
    })
    setPrice(priceTier ? priceTier.price : product.referencePrice)
  }

  // Function to toggle modal visibility
  const handleImageClick = () => {
    setShowModal(true)
  }

  // Close modal when clicked outside
  const closeModal = () => {
    setShowModal(false)
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className='container my-4'>
      <div className='row justify-content-between'>
        {/* Image Section */}
        <div className='col-md-5 text-center'>
          <div className='w-100 ratio ratio-1x1'>
            <img
              src={getOptimizedImageUrl(mainImage)}
              alt='Main Product'
              className='img-fluid rounded-3'
              onError={handleImageError}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Use 'contain' to maintain aspect ratio without deformation
              onClick={handleImageClick} // Trigger modal on click
            />
          </div>
          <div className='mt-3 d-flex justify-content-center flex-wrap'>
            {product.images.map((image, index) => (
              <div key={index} className='p-1 col-2'>
                <div className='ratio ratio-1x1'>
                  <img
                    src={getThumbnailUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    onError={handleImageError}
                    className={`img-thumbnail mx-1 ${
                      mainImage === image
                        ? 'border border-primary border-2'
                        : ''
                    }`}
                    style={{ cursor: 'pointer', objectFit: 'cover' }}
                    onClick={() => handleThumbnailClick(image)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className='col-md-6 pt-3'>
          <h2 className='mb-3'>{product.name}</h2>
          <div className='mb-3'>
            <strong>Tags:</strong>
            {product.tags.map((tag, index) => (
              <button key={index} className='btn btn-secondary p-1 mx-2'>
                {tag}
              </button>
            ))}
          </div>
          <div className='mb-3'>
            <strong>Temporada:</strong>
            {product.seasons.map((season, index) => (
              <button key={index} className='btn btn-primary p-1 mx-2'>
                {season}
              </button>
            ))}
            <strong>Categoría:</strong>
            <button className='btn btn-primary p-1 mx-2'>
              {product.category}
            </button>
          </div>

          <div className='mb-3'>
            <strong>Precios:</strong>
            <div className='d-flex justify-content-between'>
              {product.price.map((tier, index) => (
                <div key={index} className='text-center w-25'>
                  <span
                    className={
                      price === tier.price
                        ? 'text-primary'
                        : 'text-body-tertiary'
                    }
                  >
                    {tier.quantity}
                  </span>
                  <br />
                  <span
                    className={
                      price === tier.price
                        ? 'h4 text-primary'
                        : 'h4 text-body-tertiary'
                    }
                  >
                    ${tier.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p>{product.description}</p>

          {/* Mayoreo Section */}
          <div className='mb-3'>
            <strong>Mayoreo:</strong>
            <div className='d-flex align-items-center'>
              <label htmlFor='quantity' className='me-2'>
                Cantidad:
              </label>
              <input
                id='quantity'
                type='number'
                className='form-control w-25'
                value={quantity}
                onChange={handleQuantityChange}
                min={limits[0]}
                max={limits[1]}
              />
              <span className='ms-3'>
                <strong>Total:</strong> $
                {parseFloat((price * quantity).toFixed(2))}
              </span>
            </div>
          </div>

          {/* Customization Options */}
          <div className='mb-3'>
            <strong>Personaliza tu producto:</strong>
            {product.customizationOptions.map((option, index) => (
              <div key={index} className='mb-2'>
                {option.type === 'enum' ? (
                  <select
                    className='form-select'
                    onChange={e => {
                      const newSelections = {
                        ...selectedCustomizations,
                        [option.name]: e.target.value.trim()
                      }
                      setSelectedCustomizations(newSelections)
                    }}
                  >
                    {option.options.map((opt, idx) => (
                      <option key={idx} value={opt.trim()}>
                        {opt.trim()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type='text'
                    className='form-control'
                    placeholder={option.description}
                  />
                )}
              </div>
            ))}
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
          <button
            className='btn btn-primary btn-lg w-100'
            onClick={() => {
              let carrito = JSON.parse(localStorage.getItem('carrito')) || []
              carrito.push({ product: product._id, quantity, selectedCustomizations})
              localStorage.setItem('carrito', JSON.stringify(carrito))

              setMessage('Producto agregado al carrito.')
              setMessageType('success')
            }}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>

      {/* Modal for Full-Size Image */}
      {showModal && (
        <div
          className='modal show'
          style={{ display: 'block', zIndex: '1050' }}
          tabIndex='-1'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
          onClick={closeModal}
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <button
                  type='button'
                  className='btn-close'
                  aria-label='Close'
                  onClick={closeModal}
                ></button>
              </div>
              <div className='modal-body'>
                <img
                  src={mainImage}
                  onError={handleImageError}
                  alt='Full-size Product'
                  className='img-fluid'
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <Reviews reviews={product.reviews}/> */}
    </div>
  )
}

export default ProductDescription
