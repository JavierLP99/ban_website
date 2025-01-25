import React, { useState, useEffect } from 'react';

const ProductDescription = () => {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    fetch('/products.json') // Adjust the path as needed
      .then((response) => response.json())
      .then((data) => {
        setProduct(data.products[0]); // Assuming we want the first product
        setMainImage(data.products[0].images[0]); // Set initial main image
      })
      .catch((error) => console.error('Error loading content:', error));
  }, []);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* Image Section */}
        <div className="col-md-6 text-center">
          <img
            src={mainImage}
            alt="Main Product"
            className="img-fluid"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
          <div className="mt-3 d-flex justify-content-center">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="img-thumbnail mx-1"
                style={{
                  width: '60px',
                  height: '60px',
                  cursor: 'pointer',
                  border: mainImage === image ? '2px solid #007bff' : 'none',
                }}
                onClick={() => handleThumbnailClick(image)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <div className="mb-3">
            <strong>Tags:</strong>{' '}
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="badge bg-secondary me-1"
                style={{ fontSize: '14px' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h4 className="text-primary mb-3">${product.price['1-10']}</h4>
          <p>{product.description}</p>
          <button className="btn btn-primary btn-lg w-100">
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
