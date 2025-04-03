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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [categories, setCategories] = useState([])
  const status = ['Todos', 'Disponible', 'Agotado', 'Descontinuado']
  const [sortBy, setSortBy] = useState('name')
  const [order, setOrder] = useState('asc')
  const [selectedProducts, setSelectedProducts] = useState([])

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

  const handleStatusSelect = selectedStatus => {
    navigate(`/listadeproductos?status=${encodeURIComponent(selectedStatus)}`)
  }

  const handleSortChange = (sortField, sortOrder) => {
    navigate(
      `/listadeproductos?sortBy=${encodeURIComponent(sortField)}&order=${encodeURIComponent(sortOrder)}`
    )
  }

  const handleCheckboxChange = (e, item) => {
    if (e.target.checked) {
      setSelectedProducts(prev => [...prev, item.slug])
    } else {
      setSelectedProducts(prev => prev.filter(slug => slug !== item.slug))
    }
  }

  const handleDelete = async (_id) => {
    if (!_id) return
  
    try {
      await axios.delete(`https://banannylandapp.onrender.com/products/${_id}`)
      console.log(`Producto con ID ${_id} eliminado correctamente`)
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q') || ''
    const page = parseInt(params.get('page')) || 1
    const category = params.get('category') || ''
    const sortBy = params.get('sortBy') || 'name'
    const order = params.get('order') || 'asc'
    const status = params.get('status') || ''
  
    setSelectedCategory(category)
    setSearchQuery(query)
    setCurrentPage(page)
  
    axios
      .get(`https://banannylandapp.onrender.com/products`, {
        params: { page, limit: 8, sortBy, order, category, status }
      })
      .then(response => {
        setContent(response.data.products)
        setTotalPages(response.data.totalPages)
        let results = response.data.products
        if (query) {
          results = results.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        }
        setFilteredProducts(results)
      })
      .catch(error => console.error('Error fetching products:', error))
      .finally(() => setLoading(false))
  }, [location.search])

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
          onChange={e => handleCheckboxChange(e, item)}
          checked={selectedProducts.includes(item.slug)}
        />
      </th>
      <td>
        <a href={`/producto/${item.name}`} className='navbar-brand'>
          {item._id}
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
      <td>
        <a href='/' className='navbar-brand'>
          {item.tags}
        </a>
      </td>
      <td>{item.status}</td>
      <td>{item.category}</td>
      <td>$ 120</td>
      <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
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
              <a
                className='dropdown-item'
                href={`/admin/catalogo/${item.slug}`}
              >
                Modificar
              </a>
            </li>
            <li>
              <a
                className='dropdown-item'
                href={`/admin/catalogo/${item.slug}`}
              >
                Duplicar
              </a>
            </li>
            <li>
              <button
                className='dropdown-item'
                onClick={() => handleDelete(item._id)}
              >
                Eliminar
              </button>
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
          <Button
            href='/admin/catalogo'
            variant='outline-primary'
            type='submit'
          >
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
          title={selectedStatus || 'Estatus'}
          className='mx-2'
        >
          {status.map((item, index) => (
            <Dropdown.Item key={index} onClick={() => handleStatusSelect(item)}>
              {item}
            </Dropdown.Item>
          ))}
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
          title='Ordenar por fecha'
          className='mx-2'
        >
          <Dropdown.Item onClick={() => handleSortChange('updatedAt', 'desc')}>
            Más reciente
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('updatedAt', 'asc')}>
            Más antiguo
          </Dropdown.Item>
        </DropdownButton>
        <Button
          href={
            selectedProducts.length === 1
              ? `/admin/catalogo/${selectedProducts}`
              : '#'
          }
          variant='outline-primary'
          className='rounded-pill'
          type='submit'
          disabled={selectedProducts.length !== 1}
        >
          Modificar
        </Button>
        <Button
          className='btn-primary rounded-pill deleteprod'
          type='submit'
          disabled={selectedProducts.length === 0}
        >
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
              <th scope='col' className='col-2'>
                Temporada
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
                href={`/listadeproductos?page=${index + 1}`}
                onClick={e => {
                  e.preventDefault()
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
