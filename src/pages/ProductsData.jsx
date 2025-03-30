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

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q') || ''
    setSearchQuery(query)
    if (query) {
      const results = content.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredProducts(results)
    } else {
      setFilteredProducts(content)
    }
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
    // Fetch products data from the JSON file
    // fetch(
    //   'https://banannylandapp.onrender.com/products?page=1&limit=3&sortBy=updatedAt&order=desc'
    // )
    //   .then(response => response.json())
    //   .then(data => {
    //     // Update the products state with the first 3 items from the data
    //     setProducts(data.products)
    //   })
    //   .catch(error => console.error('Error fetching products:', error))
  }, [currentPage])

  const ImportDrivePhoto = (driveUrl, height) => {
    const defaultUrl =
      'https://drive.google.com/file/d/1Q7By_xG9r3a8Zr47j6b1HG7yAm91GIHO/view?usp=drive_link'

    const match = driveUrl.match(/\/d\/(.*)\//)
    const fileId = match ? match[1] : defaultUrl.match(/\/d\/(.*)\//)[1]

    const newUrl = `https://lh3.googleusercontent.com/d/${fileId}=h${height}`

    return newUrl
  }

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
      <td>Ropa</td>
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
          title='Categoría'
          className='mx-2'
        >
          <Dropdown.Item href='#/action-2'>Categoría 1</Dropdown.Item>
          <Dropdown.Item href='#/action-3'>Categoría 2</Dropdown.Item>
          <Dropdown.Item href='#/action-4'>Categoría 3</Dropdown.Item>
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
              <li className='page-item' key={index}>
                <a href='/listadeproductos' className={`page-link page-item ${currentPage === index ? 'active' : ''}`}>{index + 1}</a>
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
