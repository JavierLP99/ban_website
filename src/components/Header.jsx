import logo from '/Logo.png'

export default function Header () {
  return (
    <header>
        
      <nav
        className='navbar navbar-expand-lg bg-secondary py-3 px-5 container-fluid d-flex flex-column'
      >
        {/* Logo */}
        <div className='row justify-content-center w-100'>
          <a
            className='navbar-brand fw-bold col-5 col-sm-3 col-md-2 col-xl-2'
            to='/'
          >
            <img src={logo} alt='Banannyland' className='w-100' />

            {/* Mobile Toggle */}
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
          </a>
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
                  Nuestros servicios
                </a>
              </li>
              <li className='nav-item'>
                <a className={`nav-link fw-bold`} to='/news'>
                  Noticias
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
                <i className='bi bi-facebook'></i>
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='mx-2  h4'
              >
                <i className='bi bi-twitter'></i>
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='mx-2 h4'
              >
                <i className='bi bi-instagram'></i>
              </a>

              {/* Call to Action Button */}
              <a className='btn btn-primary ms-3' to='/contact'>
                Contáctanos
              </a>
            </div>
          </div>
        </div>

        {/* Navbar Content */}
      </nav>
    </header>
  )
}
