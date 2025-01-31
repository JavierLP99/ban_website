/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // Get the highest price from the price object
  const highestPrice = Math.max(...Object.values(product.price));

  return (
    <div className="col-12 col-sm-6 col-lgs-4 col-xl-3 mb-4">
      <div className="card rounded-4 h-100">
        <Link to={`/producto/${product.name}`} className="text-decoration-none">
        <div className='ratio ratio-1x1'>

          <img
            src={product.images[0]}
            className="card-img-top w-100"
            alt={product.name}
            style={{ objectFit: 'cover' }}
          />
                  </div>

        </Link>
        <div className="card-body d-flex flex-column">
          <Link
            to={`/producto/${product.name}`}
            className="card-title text-decoration-none text-reset"
          >
            <p className="card-title fs-4">{product.name}</p>
          </Link>
          <div className="card-text">Precio: ${highestPrice}</div>
          <div>
            <small className="text-muted">Categoría: {product.category}</small>
          </div>
          <div>
            <small className="text-muted">
              Etiquetas: {product.tags?.join(', ')}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
