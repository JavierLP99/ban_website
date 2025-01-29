import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
    return (
      <div className="row d-flex">
        {products.length > 0 ? (
          products.map((product) => (
              <ProductCard product={product} key={product.id}/>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
    );
  }
  