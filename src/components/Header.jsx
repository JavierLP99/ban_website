import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useAuth } from "react-oidc-context";

export default function Header () {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = e => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
   // Cognito code starte
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "4rcpqjuut9mjh2b6lbl4hg3b7h";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://<user pool domain>";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // if (auth.isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (auth.error) {
  //   return <div>Encountering error... {auth.error.message}</div>;
  // }

  // if (auth.isAuthenticated) {
  //   return (
  //     <div>
  //       <pre> Hello: {auth.user?.profile.email} </pre>
  //       <pre> ID Token: {auth.user?.id_token} </pre>
  //       <pre> Access Token: {auth.user?.access_token} </pre>
  //       <pre> Refresh Token: {auth.user?.refresh_token} </pre>

  //       <button onClick={() => auth.removeUser()}>Sign out</button>
  //     </div>
  //   );
  // }
  // Cognito code ends

  return (
    <header>
      <nav className='navbar navbar-expand-lg bg-light py-2 px-3 container-fluid d-flex flex-wrap'>
        <div className='d-flex w-100 align-items-center'>
          {/* Logo */}
          <div className='d-none d-md-flex justify-content-start align-items-center me-auto'>
            <a href='/' className='navbar-brand fw-bold'>
              <img
                src='/Logo.png'
                alt='Banannyland'
                style={{ width: '150px', height: 'auto' }}
              />
            </a>
          </div>

          {/* Search Bar */}
          <div className='d-flex justify-content-center flex-grow-1 mx-3'>
            <Form className='d-flex w-100' onSubmit={handleSearch}>
              <Form.Control
                type='search'
                placeholder='Buscar'
                className='me-2'
                aria-label='Search'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Button variant='outline-primary' type='submit'>
                Buscar
              </Button>
            </Form>
          </div>

          {/* Toggle Button */}
          <button
            className='navbar-toggler ms-3'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>

          {/* Buttons: Shopping Cart and Login */}
          <div className='justify-content-center gap-3 ms-4 d-none d-lg-flex'>
            <Button className='d-flex align-items-center btn btn-secondary'>
              <i className='bi bi-cart3 me-1'></i>
              Carrito
            </Button>
            <Button
              className='d-flex align-items-center btn btn-secondary'
              onClick={() => auth.signinRedirect()} // Directly calling navigate inside onClick
            >
              <i className='bi bi-person me-1'></i>
              Iniciar sesión
            </Button>
            <Button
              className='d-flex align-items-center btn btn-secondary'
              onClick={() => auth.removeUser()}            >
              <i className='bi bi-person me-1'></i>
              Cerrar sesión
            </Button>
          </div>
        </div>

        {/* Collapsible Content */}
        <div className='collapse navbar-collapse mt-1 ms-5' id='navbarNav'>
          <div className='row w-100'>
            {/* Navigation Links */}
            <ul className='navbar-nav mx-auto d-flex justify-content-center'>
              <li className='nav-item'>
                <a className='nav-link fw-bold text-primary' href='/'>
                  Inicio
                </a>
              </li>

              <DropdownButton
                id='dropdown-button-light'
                variant='light'
                title='Comprar por categoría'
                className='mx-2'
              >
                <Dropdown.Item href='#/action-1' active>
                  Cajas
                </Dropdown.Item>
                <Dropdown.Item href='#/action-2'>Tazas</Dropdown.Item>
                <Dropdown.Item href='#/action-3'>Camisas</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href='#/action-4'>Otros</Dropdown.Item>
              </DropdownButton>

              <DropdownButton
                id='dropdown-temporadas'
                variant='light'
                title='Comprar por temporada'
                className='mx-2'
              >
                <Dropdown.Item href='/season/summer'>Navidad</Dropdown.Item>
                <Dropdown.Item href='/season/winter'>
                  16 de septiembre
                </Dropdown.Item>
                <Dropdown.Item href='/season/spring'>
                  Día de muertos
                </Dropdown.Item>
              </DropdownButton>

              <li className='nav-item'>
                <a className='nav-link fw-bold text-primary' href='/promotions'>
                  Promociones
                </a>
              </li>
              {
                auth.isAuthenticated ?
                  <>
                  <li className='nav-item'>
                    <a
                      className='nav-link fw-bold text-primary'
                      href='/listadeproductos'
                    >
                      Listado
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a
                      className='nav-link fw-bold text-primary'
                      href='/banners'
                    >
                      Banners
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a
                      className='nav-link fw-bold text-primary'
                      href='/admin/categories'
                    >
                      Categorías
                    </a>
                  </li>
                  </>: null
              }
                  
  
            </ul>

            {/* Buttons: Shopping Cart and Login (Mobile) */}
            <div className='d-flex justify-content-center gap-3 d-md-none'>
              <Button className='d-flex align-items-center btn btn-secondary'>
                <i className='bi bi-cart3 me-1'></i>
                Carrito
              </Button>
              <Button className='d-flex align-items-center btn btn-secondary'>
                <i className='bi bi-person me-1'></i>
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
