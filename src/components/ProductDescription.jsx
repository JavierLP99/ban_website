import React, { useState, useEffect } from 'react'
import Reviews from './Reviews'

const ProductDescription = ({ productName }) => {
  const [product, setProduct] = useState(null)
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [showModal, setShowModal] = useState(false) // State to control modal visibility

  useEffect(() => {
    fetch('/products.json') // Adjust the path as needed
      .then(response => response.json())
      .then(data => {
        setProduct(data.products.find(item => item.name === productName))
      })
      .catch(error => console.error('Error loading content:', error))
  }, [productName])

  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]) // Set initial main image
      setPrice(product.price['1-10'])
    }
  }, [product])

  const handleThumbnailClick = image => {
    setMainImage(image)
  }

  const handleQuantityChange = e => {
    const newQuantity = e.target.value
    setQuantity(newQuantity)

    if (newQuantity >= 1 && newQuantity <= 10) {
      setPrice(product.price['1-10'])
    } else if (newQuantity >= 11 && newQuantity <= 50) {
      setPrice(product.price['11-50'])
    } else if (newQuantity >= 51) {
      setPrice(product.price['51-100'])
    }
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
              src={'../' + mainImage}
              alt='Main Product'
              className='img-fluid rounded-3'
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Use 'contain' to maintain aspect ratio without deformation
              onClick={handleImageClick} // Trigger modal on click
            />
          </div>
          <div className='mt-3 d-flex justify-content-center flex-wrap'>
            {product.images.map((image, index) => (
              <div key={index} className='p-1 col-2'>
                <div className='ratio ratio-1x1'>
                  <img
                    src={'../' + image}
                    alt={`Thumbnail ${index + 1}`}
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
            <strong>Tags:</strong>{' '}
            {product.tags.map((tag, index) => (
              <button key={index} className='btn btn-secondary p-1 mx-2'>
                {tag}
              </button>
            ))}
          </div>
          <div className='mb-3'>
            <strong>Precios:</strong>
            <div className='d-flex justify-content-between'>
              <div className='text-center w-25'>
                <span
                  className={
                    price === product.price['1-10']
                      ? 'text-primary'
                      : 'text-body-tertiary'
                  }
                >
                  1-10
                </span>
                <br />
                <span
                  className={
                    price === product.price['1-10']
                      ? 'h4 text-primary'
                      : 'h4 text-body-tertiary'
                  }
                >
                  ${product.price['1-10']}
                </span>
              </div>
              <div className='text-center w-25'>
                <span
                  className={
                    price === product.price['11-50']
                      ? 'text-primary'
                      : 'text-body-tertiary'
                  }
                >
                  11-50
                </span>
                <br />
                <span
                  className={
                    price === product.price['11-50']
                      ? 'h4 text-primary'
                      : 'h4 text-body-tertiary'
                  }
                >
                  ${product.price['11-50']}
                </span>
              </div>
              <div className='text-center w-25'>
                <span
                  className={
                    price === product.price['51-100']
                      ? 'text-primary'
                      : 'text-body-tertiary'
                  }
                >
                  51-100
                </span>
                <br />
                <span
                  className={
                    price === product.price['51-100']
                      ? 'h4 text-primary'
                      : 'h4 text-body-tertiary'
                  }
                >
                  ${product.price['51-100']}
                </span>
              </div>
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
                min='1'
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
                {option === 'Color' ? (
                  <select className='form-select'>
                    {product.availableColors.map((color, idx) => (
                      <option key={idx} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                ) : option === 'Talla' ? (
                  <select className='form-select'>
                    {product.sizeOptions.map((size, idx) => (
                      <option key={idx} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type='text'
                    className='form-control'
                    placeholder={`Ingrese ${option.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>

          <button className='btn btn-primary btn-lg w-100'>
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
                  src={'../' + mainImage}
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
