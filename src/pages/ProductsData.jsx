import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

const ProductsData = () => {
  const [content, setContent] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCount, setSelectedCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q') || ''
    const page = parseInt(params.get('page')) || 1
    const category = params.get('category') || '' // Obtener la categoría de la URL

    setSearchQuery(query)
    setCurrentPage(page)

    let results = content

    if (query) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (category) {
      results = results.filter(item => item.category === category)
    }

    setFilteredProducts(results)
  }, [location.search, content])

  const handleSearch = e => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/listadeproductos?q=${encodeURIComponent(searchQuery)}`)
    } else {
      setFilteredProducts(content)
      navigate('/listadeproductos')
    }
  }

  const handleCategorySelect = selectedCategory => {
    navigate(
      `/listadeproductos?category=${encodeURIComponent(selectedCategory)}`
    )
  }

  const handleCheckboxChange = e => {
    setSelectedCount(prev =>
      e.target.checked ? prev + 1 : Math.max(prev - 1, 0)
    )
  }

  useEffect(() => {
    axios
      .get(
        `https://banannylandapp.onrender.com/products?page=${currentPage}&limit=8&sortBy=updatedAt&order=desc`
      )
      .then(response => {
        setContent(response.data.products)
        setTotalPages(response.data.totalPages)
      })
      .catch(error => console.error('Error fetching products:', error))
      .finally(() => setLoading(false))
  }, [currentPage])

  useEffect(() => {
    axios
      .get(`https://banannylandapp.onrender.com/categories`)
      .then(response => {
        setCategories(response.data.categories)
      })
      .catch(error => console.error('Error fetching categories:', error))
  }, [])

  if (loading) {
    return (
      <div className='d-flex justify-content-center align-items-center'>
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Cargando...</span>
          </div>
          <p className='mt-2 text-muted'>Por favor, espera...</p>
        </div>
      </div>
    )
  }

  const product = item => (
    <tr key={item.id}>
      <th scope='row'>
        <input
          type='checkbox'
          className='form-check-input border-dark'
          onChange={handleCheckboxChange}
        />
      </th>
      <td>
        <a href={`/producto/${item.name}`} className='navbar-brand'>
          BAN2178
        </a>
      </td>
      <td className='col-1'>
        <div className='ratio ratio-1x1'>
          <a href={`/producto/${item.name}`} className='navbar-brand'>
            <img
              src={item.images[0]}
              alt='Main Product'
              className='w-100 h-100 object-fit-cover'
            />
          </a>
        </div>
      </td>
      <td>
        <a href='/' className='navbar-brand'>
          {item.name}
        </a>
      </td>
      <td>Activo</td>
      <td>{item.category}</td>
      <td>$ 120</td>
      <td>30 de abril del 2025</td>
      <td>
        {' '}
        <div className='dropdown'>
          <button
            className='btn btn-light border-0'
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            ...
          </button>
          <ul className='dropdown-menu'>
            <li>
              <a className='dropdown-item' href='#'>
                Modificar
              </a>
            </li>
            <li>
              <a className='dropdown-item' href='#'>
                Duplicar
              </a>
            </li>
            <li>
              <a className='dropdown-item' href='#'>
                Eliminar
              </a>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  )

  return (
    <div className='container'>
      <h3>Lista de Productos</h3>
      <div className='row mt-5'>
        <div className='d-flex justify-content-center col-6'>
          <Form className='d-flex w-100 input-group' onSubmit={handleSearch}>
            <Form.Control
              type='search'
              className='me-2'
              aria-label='Search'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {!searchQuery && (
              <div className='bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
            )}
            <Button variant='outline-primary' type='submit'>
              Buscar
            </Button>
          </Form>
        </div>
        <div className='d-flex justify-content-end col-5'>
          <Button variant='outline-primary' type='submit'>
            <p className='bi bi-plus-circle mb-0'>Añadir producto</p>
          </Button>
        </div>
      </div>
      <div className='d-flex justify-content-between mt-3'>
        <DropdownButton
          id='dropdown-button-light'
          variant='light border border-2'
          title={selectedCategory || 'Categoría'}
          className='mx-2'
        >
          {[...new Set(categories.map(item => item.name))].map(category => (
            <Dropdown.Item
              key={category}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          id='dropdown-button-light'
          variant='light border border-2'
          title='Estatus'
          className='mx-2'
        >
          <Dropdown.Item href='#/action-2'>Estatus 1</Dropdown.Item>
          <Dropdown.Item href='#/action-3'>Estatus 2</Dropdown.Item>
          <Dropdown.Item href='#/action-4'>Estatus 3</Dropdown.Item>
        </DropdownButton>
        <DropdownButton
          id='dropdown-button-light'
          variant='light border border-2'
          title='Temporada'
          className='mx-2'
        >
          <Dropdown.Item href='#/action-2'>Temporada 1</Dropdown.Item>
          <Dropdown.Item href='#/action-3'>Temporada 2</Dropdown.Item>
          <Dropdown.Item href='#/action-4'>Temporada 3</Dropdown.Item>
        </DropdownButton>
        <DropdownButton
          id='dropdown-button-light'
          variant='light border border-2'
          title='Fecha de actualización'
          className='mx-2'
        >
          <Dropdown.Item href='#/action-2'>Ascendente</Dropdown.Item>
          <Dropdown.Item href='#/action-3'>Descendete</Dropdown.Item>
        </DropdownButton>
        <Button
          variant='outline-primary'
          className='rounded-pill'
          type='submit'
          disabled={selectedCount >= 2}
        >
          Modificar
        </Button>
        <Button className='btn-primary rounded-pill deleteprod' type='submit'>
          Eliminar
        </Button>
      </div>
      <div className='table-responsive'>
        <table className='table align-middle mt-4'>
          <thead>
            <tr>
              <th scope='col' style={{ width: '40px' }}></th>
              <th scope='col' className='col-1'>
                ID
              </th>
              <th scope='col' className='col-1'>
                Imagen
              </th>
              <th scope='col' className='col-2'>
                Nombre
              </th>
              <th scope='col'>Estatus</th>
              <th scope='col'>Categoría</th>
              <th scope='col'>Costo unitario</th>
              <th scope='col'>Fecha de actualización</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>{filteredProducts.map(item => product(item))}</tbody>
        </table>
      </div>
      <nav aria-label='Page navigation'>
        <ul className='pagination justify-content-end'>
          <li className='page-item'>
            <a
              className='page-link'
              href='/listadeproductos'
              aria-label='Previous'
            >
              <span aria-hidden='true'>&laquo;</span>
            </a>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              className={`page-item ${
                currentPage === index + 1 ? 'active' : ''
              }`}
              key={index}
            >
              <a
                className='page-link'
                href={`/listadeproductos?page=${index + 1}`} // Cambia la URL
                onClick={e => {
                  e.preventDefault() // Evita el recargo de la página
                  navigate(`/listadeproductos?page=${index + 1}`)
                }}
              >
                {index + 1}
              </a>
            </li>
          ))}
          <li className='page-item'>
            <a
              className='page-link'
              href='/listadeproductos'
              aria-label='Previous'
            >
              <span aria-hidden='true'>&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default ProductsData
