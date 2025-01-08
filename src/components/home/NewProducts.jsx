import React from "react";

const NewProducts = () => {
  const products = [
    { id: 1, name: "Tazas decoradas" },
    { id: 2, name: "Playeras estampadas" },
    { id: 3, name: "Servilletas" },
  ];

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-3">Nuevos productos</h2>
        <p className="text-muted mb-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="row justify-content-center">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-4"
            >
              <div className="card rounded shadow-sm" style={{ width: "18rem" }}>
                <div
                  className="card-body bg-light d-flex flex-column justify-content-center align-items-center"
                  style={{ height: "200px" }}
                >
                  {/* Placeholder for image */}
                  <div
                    className="w-100 h-100 bg-secondary rounded"
                    style={{ opacity: 0.5 }}
                  ></div>
                </div>
                <div className="card-footer text-center fw-bold">
                  {product.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-dark rounded-pill px-4 py-2">
          ¡Lo quiero!
        </button>
      </div>
    </section>
  );
};

export default NewProducts;
