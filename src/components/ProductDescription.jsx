import React, { useState, useEffect } from 'react'

const ProductDescription = () => {
  const [product, setProduct] = useState(null)
  const [mainImage, setMainImage] = useState('')

  useEffect(() => {
    fetch('/products.json') // Adjust the path as needed
      .then(response => response.json())
      .then(data => {
        setProduct(data.products[0]) // Assuming we want the first product
        setMainImage(data.products[0].images[0]) // Set initial main image
      })
      .catch(error => console.error('Error loading content:', error))
  }, [])

  const handleThumbnailClick = image => {
    setMainImage(image)
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className='container my-4'>
      <div className='row'>
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
                  className={`img-thumbnail mx-1 ${mainImage === image ? 'border border-primary border-2' : ''}`}
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => handleThumbnailClick(image)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className='col-md-7 px-5 pt-3'>
          <h2 className='mb-3'>{product.name}</h2>
          <div className='mb-3'>
            <strong>Tags:</strong>{' '}
            {product.tags.map((tag, index) => (
              <button
                key={index}
                className='btn btn-secondary  p-1 mx-2'
              >
                {tag}
              </button>
            ))}
          </div>
          <h4 className='text-primary mb-3'>${product.price['1-10']}</h4>
          <p>{product.description}</p>
          <button className='btn btn-primary btn-lg w-100'>
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDescription
