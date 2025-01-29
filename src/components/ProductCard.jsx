import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // Get the highest price from the price object
  const highestPrice = Math.max(...Object.values(product.price));

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div className="card rounded-4 h-100">
        <Link to={`/product/${product.name}`} className="text-decoration-none">
          <img
            src={product.images[0]}
            className="card-img-top"
            alt={product.name}
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <Link
            to={`/product/${product.name}`}
            className="card-title text-decoration-none text-reset"
          >
            <h5 className="card-title">{product.name}</h5>
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
