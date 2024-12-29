import logo from '/Logo.png'

export default function Header () {
  return (
    <header>
        
      <nav
        className='navbar navbar-expand-lg bg-secondary py-3 px-1 container-fluid d-flex flex-column'
      >
        {/* Logo */}
        <div className='row justify-content-center w-100'>
          <div
            className='navbar-brand fw-bold d-flex justify-content-between w-100 justify-content-lg-center'
            to='/'
          >
              <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarNav'
              aria-controls='navbarNav'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon'></span>
            </button>
            <img src={logo} alt='Banannyland' className='col-8 col-sm-4 col-md-3 col-xl-2 ' />

          
          </div>
        </div>
        <div className='row'>
          <div className='collapse navbar-collapse p-4' id='navbarNav'>
            <ul className='navbar-nav mx-auto'>
              <li className='nav-item'>
                <a className={`nav-link fw-bold `} to='/'>
                  Inicio
                </a>
              </li>
              <li className='nav-item'>
                <a className={`nav-link fw-bold `} to='/services'>
                  Comprar por categoría
                </a>
              </li>
              <li className='nav-item'>
                <a className={`nav-link fw-bold`} to='/news'>
                  Comprar por temporada
                </a>
              </li>
              <li className='nav-item'>
                <a className={`nav-link fw-bold`} to='/news'>
                  Promociones
                </a>
              </li>
            </ul>

            {/* Social Media Icons & CTA */}
            <div className='d-flex align-items-center'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='mx-2 h4'
              >
                <i className='bi bi-cart-check'></i>
              </a>

              {/* Call to Action Button */}
              
              {/* Call to Action Button */}
              <a className='btn btn-primary ms-3' to='/contact'>
                Inicia sesión
              </a>
            </div>
          </div>
        </div>

        {/* Navbar Content */}
      </nav>
    </header>
  )
}
