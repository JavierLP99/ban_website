import React from 'react';

const Reviews = ({ reviews }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning me-1`}
      ></span>
    ));
  };

  return (
    <div className="container mt-4">
      <h2 className='my-3'>Opiniones de nuestros clientes</h2>
      <div className="row">
        {reviews.map((review, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="card-text">{review.text}</p>
                <small className="text-muted">- {review.author}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage


export default Reviews;
