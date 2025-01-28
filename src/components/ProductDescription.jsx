import React, { useState, useEffect } from 'react'
import Reviews from './Reviews'

const ProductDescription = () => {
  const [product, setProduct] = useState(null)
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)

  useEffect(() => {
    fetch('/products.json') // Adjust the path as needed
      .then(response => response.json())
      .then(data => {
        setProduct(data.products[0]) // Assuming we want the first product
        setMainImage(data.products[0].images[0]) // Set initial main image
        setPrice(product.price['1-10'])
      })
      .catch(error => console.error('Error loading content:', error))
  }, [product])

  const handleThumbnailClick = image => {
    setMainImage(image)
  }

  if (!product) {
    return <div>Loading...</div>
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

  return (
    <div className='container my-4'>
      <div className='row justify-content-between'>
        {/* Image Section */}
        <div className='col-md-5 text-center'>
          <div className='w-100 ratio ratio-1x1'>
            <img
              src={mainImage}
              alt='Main Product'
              className='img-fluid'
              style={{ width: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className='mt-3 d-flex justify-content-center flex-wrap'>
            {product.images.map((image, index) => (
              <div key={index} className='p-1 col-2'>
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`img-thumbnail mx-1 ${
                    mainImage === image ? 'border border-primary border-2' : ''
                  }`}
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => handleThumbnailClick(image)}
                />
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
              <button key={index} className='btn btn-secondary  p-1 mx-2'>
                {tag}
              </button>
            ))}
          </div>
          <div style={{ height: '40px' }}>
            {product.price['1-10'] === price ? (
              <span className=' h4 text-primary mb-3'>
                ${product.price['1-10']}
              </span>
            ) : (
              <p>
                <span className='h4 text-body-tertiary mb-3'>
                  ${product.price['1-10']}
                </span>
                <span className='h4 text-primary mb-3'>
                  {' Ahora  $ ' + price}
                </span>
              </p>
            )}
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
      
      <Reviews reviews={product.reviews}/>
    </div>
  )
}

export default ProductDescription
