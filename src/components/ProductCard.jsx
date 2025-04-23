/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import {
  getThumbnailUrl,
  getSquarePreviewUrl,
  getOptimizedImageUrl,
  handleImageError
} from '../utils/tools.jsx'

export default function ProductCard ({ product, className }) {
  // Get the highest price from the price object

  return (
    <div className={`mb-4 ${className}`}>
      <div className='card rounded-4 h-100'>
        <Link to={`/producto/${product.slug}`} className='text-decoration-none'>
          <div className='ratio ratio-1x1'>
            <img
              src={getOptimizedImageUrl(product.images[0])}
              className='card-img-top w-100'
              onError={handleImageError}
              alt={product.name}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Link>
        <div className='card-body d-flex flex-column'>
          <Link
            to={`/producto/${product.slug}`}
            className='card-title text-decoration-none text-reset'
          >
            <p className='card-title fs-4'>{product.name}</p>
          </Link>
          <div className='card-text'>Precio: ${product.referencePrice}</div>
          <div>
            <small className='text-muted'>Categoría: {product.category}</small>
          </div>
          <div>
            <small className='text-muted'>
              Etiquetas: {product.tags?.join(', ')}
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}
