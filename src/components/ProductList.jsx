import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  return (
    <div className="row d-flex">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard 
            product={product} 
            key={product._id} // Make sure to use _id instead of id if that's what your API uses
            className='col-12 col-md-4 col-lg-3'
          />
        ))
      ) : (
        <p>No se encontraron productos.</p>
      )}
    </div>
  );
}