import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useAuth } from 'react-oidc-context'
import axios from 'axios'

export default function Header () {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [seasons, setSeasons] = useState([])
  const navigate = useNavigate()
  const auth = useAuth()

  const handleSearch = e => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, seasonRes] = await Promise.all([
        axios.get('https://banannylandapp.onrender.com/categories'),
        axios.get('https://banannylandapp.onrender.com/seasons')
        ])
        setCategories(catRes.data.categories || [])
        setSeasons(seasonRes.data.seasons || [])
      } catch (error) {
        console.error('Error loading categories or seasons', error)
      }
    }
    fetchData()
  }, [])

  return (
    <header>
      <nav className='navbar navbar-expand-lg bg-light py-2 px-3 container-fluid d-flex flex-wrap'>
        <div className='d-flex w-100 align-items-center'>
          <div className='d-none d-md-flex justify-content-start align-items-center me-auto'>
            <a href='/' className='navbar-brand fw-bold'>
              <img
                src='/Logo.png'
                alt='Banannyland'
                style={{ width: '150px', height: 'auto' }}
              />
            </a>
          </div>

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

          <div className='justify-content-center gap-3 ms-4 d-none d-lg-flex'>
            <Button className='btn btn-secondary' onClick={() => navigate('/carrito')}>
              <i className='bi bi-cart3 me-1'></i> Carrito
            </Button>
            {!auth.isAuthenticated && (
              <Button className='btn btn-secondary' onClick={() => auth.signinRedirect()}>
                <i className='bi bi-person me-1'></i> Iniciar sesión
              </Button>
            )}
            {auth.isAuthenticated && (
              <Button className='btn btn-secondary' onClick={() => auth.removeUser()}>
                <i className='bi bi-box-arrow-right me-1'></i> Cerrar sesión
              </Button>
            )}
          </div>
        </div>

        <div className='collapse navbar-collapse mt-1 ms-5' id='navbarNav'>
          <div className='row w-100'>
            <ul className='navbar-nav mx-auto d-flex justify-content-center'>
              <li className='nav-item'>
                <a className='nav-link fw-bold text-primary' href='/'>Inicio</a>
              </li>

              {/* Categories */}
              <DropdownButton
                id='dropdown-categories'
                variant='light'
                title='Comprar por categoría'
                className='mx-2'
              >
                {categories.map(cat => (
                  <Dropdown.Item
                    key={cat.name}
                    href={`/search?category=${encodeURIComponent(cat.name)}`}
                  >
                    {cat.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>

              {/* Seasons */}
              <DropdownButton
                id='dropdown-seasons'
                variant='light'
                title='Comprar por temporada'
                className='mx-2'
              >
                {seasons.map(season => (
                  <Dropdown.Item
                    key={season.name}
                    href={`/search?season=${encodeURIComponent(season.name)}`}
                  >
                    {season.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>

              <li className='nav-item'>
                <a className='nav-link fw-bold text-primary' href='/promotions'>Promociones</a>
              </li>

              {auth.isAuthenticated && (
                <>
                  <li className='nav-item'>
                    <a className='nav-link fw-bold text-primary' href='/listadeproductos'>Listado</a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link fw-bold text-primary' href='/banners'>Banners</a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link fw-bold text-primary' href='/admin/categories'>Categorías</a>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile Buttons */}
            <div className='d-flex justify-content-center gap-3 d-lg-none mt-3'>
              <Button className='btn btn-secondary' onClick={() => navigate('/carrito')}>
                <i className='bi bi-cart3 me-1'></i> Carrito
              </Button>
              {!auth.isAuthenticated && (
                <Button className='btn btn-secondary' onClick={() => auth.signinRedirect()}>
                  <i className='bi bi-person me-1'></i> Iniciar sesión
                </Button>
              )}
              {auth.isAuthenticated && (
                <Button className='btn btn-secondary' onClick={() => auth.removeUser()}>
                  <i className='bi bi-box-arrow-right me-1'></i> Cerrar sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
