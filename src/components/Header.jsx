import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Header() {
  useEffect(() => {
    // Ensure dropdowns are properly initialized when the component mounts
    const bootstrap = window.bootstrap;
    if (bootstrap) {
      const dropdowns = document.querySelectorAll('.dropdown-toggle');
      dropdowns.forEach((dropdown) => {
        new bootstrap.Dropdown(dropdown); // Manually initialize dropdown
      });
    }
  }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-light py-0 px-1 container-fluid d-flex flex-column">
        <div className="row justify-content-center w-100">
          <div className="navbar-brand fw-bold d-flex justify-content-between w-100 justify-content-lg-center">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <img src="/Logo.png" alt="Banannyland" className="col-8 col-sm-4 col-md-3 col-xl-2" />
          </div>
        </div>

        <div className="row">
          <div className="collapse navbar-collapse px-4 py-1" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link fw-bold" href="/">Inicio</a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle fw-bold"
                  href="#"
                  id="categoriasDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Comprar por categoría <span>▼</span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="categoriasDropdown">
                  <li><a className="dropdown-item" href="/category/1">Categoría 1</a></li>
                  <li><a className="dropdown-item" href="/category/2">Categoría 2</a></li>
                  <li><a className="dropdown-item" href="/category/3">Categoría 3</a></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle fw-bold"
                  href="#"
                  id="temporadasDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Comprar por temporada <span>▼</span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="temporadasDropdown">
                  <li><a className="dropdown-item" href="/season/summer">Verano</a></li>
                  <li><a className="dropdown-item" href="/season/winter">Invierno</a></li>
                  <li><a className="dropdown-item" href="/season/spring">Primavera</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-bold" href="/promotions">Promociones</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
