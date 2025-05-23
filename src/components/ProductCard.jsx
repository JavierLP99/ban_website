import { Link } from 'react-router-dom';
import {
  getOptimizedImageUrl,
  handleImageError
} from '../utils/tools.jsx';

export default function ProductCard({ product, className }) {
  return (
    <div className={`mb-4 ${className}`}>
      <Link
        to={`/producto/${product.slug}`}
        state={{ product }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className='card rounded-4 h-100'>
          <div className='ratio ratio-1x1'>
            <img
              src={getOptimizedImageUrl(product.images[0])}
              className='card-img-top w-100'
              onError={handleImageError}
              alt={product.name}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className='card-body d-flex flex-column'>
            <p className='card-title fs-4'>{product.name}</p>
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
      </Link>
    </div>
  );
}
