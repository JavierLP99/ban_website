import React, { useState, useEffect, useRef } from 'react';
import './NewProducts.css'; // Assuming external CSS file for styling

const NewProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Tazas decoradas',
      image:
        'https://scontent.fdxb5-1.fna.fbcdn.net/v/t39.30808-6/438088786_408837118668737_7030825104080284964_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=i_zs_x0RILcQ7kNvgGkk_SO&_nc_zt=23&_nc_ht=scontent.fdxb5-1.fna&_nc_gid=A2JrgxVL2GLva-hr9NctGry&oh=00_AYD5tF_3_fr-BkZoaNGP6DEDT_vmXh6kuT-n3EXYfaofbA&oe=6784830E',
      url: '/tazas-decoradas' // Example URL
    },
    {
      id: 2,
      name: 'Playeras estampadas',
      image:
        'https://scontent.fdxb5-1.fna.fbcdn.net/v/t39.30808-6/416672208_346190464933403_1266186964777694511_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=RIWpgFjEfLMQ7kNvgF5kz7u&_nc_zt=23&_nc_ht=scontent.fdxb5-1.fna&_nc_gid=ATChLW7CchBkLN1PII7tIZp&oh=00_AYDkZMK0zC5_fnzZC-uvosgfK_3UOSbuMsy89UYd8ayaXw&oe=67849AC4',
      url: '/playeras-estampadas' // Example URL
    },
    {
      id: 3,
      name: 'Esferas',
      image:
        'https://scontent.fdxb5-1.fna.fbcdn.net/v/t39.30808-6/403699011_319573657595084_7715977954447394606_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Aq62gKQ16-4Q7kNvgEGc_Kx&_nc_zt=23&_nc_ht=scontent.fdxb5-1.fna&_nc_gid=AWFk6JTjTcQzdJjMV-nGqEJ&oh=00_AYDZLVd4_0B0nD4IXtvmxIE2s_y0UOn3i87Jq3lanIGxFw&oe=67848331',
      url: '/esferas' // Example URL
    }
  ];

  const Card = ({ image, name, url }) => {
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
      const width = cardRef.current.offsetWidth;
      const height = cardRef.current.offsetHeight;
      const x = e.pageX - cardRef.current.offsetLeft - width / 2;
      const y = e.pageY - cardRef.current.offsetTop - height / 2;
      setMouseX(x);
      setMouseY(y);
    };

    const handleMouseLeave = () => {
      setMouseX(0);
      setMouseY(0);
    };

    const mousePX = mouseX / cardRef.current?.offsetWidth;
    const mousePY = mouseY / cardRef.current?.offsetHeight;

    // Increase the sensitivity for a quicker response
    const cardStyle = {
      transform: `rotateY(${mousePX * 45}deg) rotateX(${mousePY * -45}deg)` // Increased the rotation degrees
    };

    // Ensure the background scales without leaving white space
    const cardBgTransform = {
      transform: `translateX(${mousePX * -60}px) translateY(${mousePY * -60}px) scale(1.1)` // Slight scale for background
    };

    const cardBgImage = {
      backgroundImage: `url(${image})`
    };

    return (
      <a href={url} className="card-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={cardRef}>
        <div className="card" style={cardStyle}>
          <div className="card-bg" style={{ ...cardBgTransform, ...cardBgImage }}></div>
          <div className="card-info">
            <h1>{name}</h1>
            <p>
              Explora las características únicas de nuestros productos.
            </p>
          </div>
        </div>
      </a>
    );
  };

  return (
    <section className="py-5 new-products-section">
      <div className="container text-center">
        <h2 className="fw-bold mb-3">Nuevos productos</h2>
        <p className="text-muted mb-5">
          Descubre nuestros últimos productos diseñados con pasión y calidad.
        </p>
        <div className="row justify-content-center">
          {products.map((product) => (
            <div key={product.id} className="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-4">
              <Card image={product.image} name={product.name} url={product.url} />
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
