import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function Header () {
  return (
    <header>
      <nav className='navbar navbar-expand-lg bg-light py-0 px-1 container-fluid d-flex flex-column'>
        <div className='row justify-content-center w-100'>
          <div className='navbar-brand fw-bold d-flex justify-content-between w-100 justify-content-lg-between align-items-center'>
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
            <img
              src='/Logo.png'
              alt='Banannyland'
              className='col-8 col-sm-4 col-md-3 col-xl-2'
            />

            <Form className='d-flex h-50 col-4'>
              <Form.Control
                type='search'
                placeholder='Search'
                className='me-2'
                aria-label='Search'
              />
              <Button variant='outline-success'>Search</Button>
            </Form>
          </div>
        </div>

        <div className='row'>
          <div className='collapse navbar-collapse px-4 py-1' id='navbarNav'>
            <ul className='navbar-nav mx-auto'>
              <li className='nav-item'>
                <a className='nav-link fw-bold' href='/'>
                  Inicio
                </a>
              </li>

              <DropdownButton
                id='dropdown-button-light'
                variant='light'
                title='Comprar por categoría'
                data-bs-theme='light'
              >
                <Dropdown.Item href='#/action-1' active>
                  Cajas
                </Dropdown.Item>
                <Dropdown.Item href='#/action-2'>Tazas</Dropdown.Item>
                <Dropdown.Item href='#/action-3'>Camisas</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href='#/action-4'>Separated link</Dropdown.Item>
              </DropdownButton>

              <DropdownButton
                id='dropdown-temporadas'
                variant='light'
                title='Comprar por temporada'
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
                <a className='nav-link fw-bold' href='/promotions'>
                  Promociones
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
