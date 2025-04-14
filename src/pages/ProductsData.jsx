import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Modal } from 'react-bootstrap'

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
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => setShowModal(false)
  const handleCloseConfirmModal = () => setShowConfirmModal(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [productToHardDelete, setProductToHardDelete] = useState(null)

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
      `/listadeproductos?sortBy=${encodeURIComponent(
        sortField
      )}&order=${encodeURIComponent(sortOrder)}`
    )
  }

  const handleCheckboxChange = (e, item) => {
    if (e.target.checked) {
      setSelectedProducts(prev => [...prev, item._id])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== item._id))
    }
  }

  const handleDelete = async (_id, status) => {
    if (!_id) return

    if (status === 'Descontinuado' || status === 'Borrador') {
      setProductToHardDelete(_id)
      setShowConfirmModal(true)
      return
    }

    try {
      await axios.delete(`https://banannylandapp.onrender.com/products/${_id}`)
      setShowModal(true)
      fetchProducts()
      setTimeout(() => setShowModal(false), 5000)
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
    }
  }

  const confirmHardDelete = async () => {
    try {
      await axios.delete(
        `https://banannylandapp.onrender.com/products/${productToHardDelete}/hardDelete`
      )
      setShowConfirmModal(false)
      setShowModal(true)
      fetchProducts()
      setTimeout(() => setShowModal(false), 2500)
    } catch (error) {
      console.error('Error al hacer hardDelete:', error)
    }
  }

  const handleDeleteMassive = async () => {
    if (selectedProducts.length === 0) return
    try {
      await Promise.all(
        selectedProducts.map(_id =>
          axios.delete(`https://banannylandapp.onrender.com/products/${_id}`)
        )
      )
      setSelectedProducts([])
      setShowModal(true)
      fetchProducts()
      setTimeout(() => setShowModal(false), 2500)
    } catch (error) {
      console.error('Error al eliminar productos:', error)
    }
  }

  const fetchProducts = () => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q') || ''
    const page = parseInt(params.get('page')) || 1
    const category = params.get('category') || ''
    const sortBy = params.get('sortBy') || 'name'
    const order = params.get('order') || 'asc'
    const status = params.get('status') || ''

    setCurrentPage(page)
    setLoading(true)

    const axiosParams = {
      sortBy,
      order,
      category,
      status,
      search: query
    }

    if (!query) {
      axiosParams.page = page
      axiosParams.limit = 8
    }

    axios
      .get(`https://banannylandapp.onrender.com/products/all`, {
        params: axiosParams
      })
      .then(response => {
        setContent(response.data.products)
        setFilteredProducts(response.data.products)
        setTotalPages(response.data.totalPages || 1)
      })
      .catch(error => console.error('Error fetching products:', error))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
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
      <th scope='row' className='d-none d-md-table-cell'>
        <input
          type='checkbox'
          className='form-check-input border-dark'
          onChange={e => handleCheckboxChange(e, item)}
          checked={selectedProducts.includes(item._id)}
        />
      </th>
      <td>
        <div className='ratio ratio-1x1'>
          <a href={`/producto/${item.slug}`} className='navbar-brand'>
            <img
              src={item.images[0]}
              alt='Main Product'
              className='w-100 h-100 object-fit-cover'
            />
          </a>
        </div>
      </td>
      <td>
        <a href={`/producto/${item.slug}`} className='navbar-brand text-wrap'>
          {item.name}
        </a>
      </td>
      <td className='d-none d-lg-table-cell'>
        <a href='/' className='navbar-brand text-wrap'>
          {item.tags}
        </a>
      </td>
      <td>{item.status}</td>
      <td className='d-none d-md-table-cell'>{item.category}</td>
      <td className='d-none d-md-table-cell'>$ 120</td>
      <td className='d-none d-sm-table-cell'>
        {new Date(item.updatedAt).toLocaleDateString()}
      </td>
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
                href={`/admin/catalogo/?id=${item._id}`}
              >
                Duplicar
              </a>
            </li>
            <li>
              <button
                className='dropdown-item'
                onClick={() => handleDelete(item._id, item.status)}
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
    <div className='container my-4'>
      <h1>Lista de Productos</h1>
      <div className='d-flex flex-column flex-md-row justify-content-between mt-5'>
        <div className='col-12 col-md-6'>
          <Form
            className='d-flex w-100 input-group'
            onSubmit={e => {
              e.preventDefault()
              navigate(`/listadeproductos?q=${encodeURIComponent(searchQuery)}`)
            }}
          >
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
        <div className='justify-content-md-end mt-3 mt-md-0'>
          <Button
            href='/admin/catalogo'
            variant='outline-primary'
            type='submit'
          >
            <p className='bi bi-plus-circle mb-0'>Añadir producto</p>
          </Button>
        </div>
      </div>

      <button
        className='btn btn-primary d-md-none mt-3'
        type='button'
        data-bs-toggle='offcanvas'
        data-bs-target='#offcanvasFilters'
        aria-controls='offcanvasFilters'
      >
        Aplicar Filtros
      </button>

      <div
        className='offcanvas offcanvas-start'
        tabIndex='-1'
        id='offcanvasFilters'
        aria-labelledby='offcanvasFiltersLabel'
      >
        <div className='offcanvas-header'>
          <h5 className='offcanvas-title' id='offcanvasFiltersLabel'>
            Filtros
          </h5>
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='offcanvas'
            aria-label='Cerrar'
          ></button>
        </div>
        <div className='offcanvas-body'>
          <div className='mb-3'>
            <label className='form-label'>Categoría</label>
            <select
              className='form-select'
              onChange={e => handleCategorySelect(e.target.value)}
            >
              <option value=''>Selecciona una categoría</option>
              {[...new Set(categories.map(item => item.name))].map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <label className='form-label'>Estatus</label>
            <select
              className='form-select'
              onChange={e => handleStatusSelect(e.target.value)}
            >
              <option value=''>Selecciona una categoría</option>
              {status.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
            <label className='form-label'>Fecha</label>
            <select
              className='form-select'
              onChange={e => {
                const value = e.target.value
                if (value === 'recent') {
                  handleSortChange('updatedAt', 'desc')
                } else if (value === 'oldest') {
                  handleSortChange('updatedAt', 'asc')
                }
              }}
            >
              <option value=''>Selecciona una categoría</option>
              <option value='recent'>Más reciente</option>
              <option value='oldest'>Más antiguo</option>
            </select>
          </div>
        </div>
      </div>

      <div className='d-none d-md-flex justify-content-md-between mt-3'>
        <DropdownButton
          id='dropdown-button-light'
          variant='light border border-2'
          title={selectedCategory || 'Categoría'}
          className='d-none d-md-block'
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
          className='d-none d-md-block'
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
          className='d-none d-md-block'
        >
          <Dropdown.Item href='#/action-2'>Temporada 1</Dropdown.Item>
          <Dropdown.Item href='#/action-3'>Temporada 2</Dropdown.Item>
          <Dropdown.Item href='#/action-4'>Temporada 3</Dropdown.Item>
        </DropdownButton>
        <DropdownButton
          id='dropdown-button-light'
          variant='light border border-2'
          title='Fecha'
          className='d-none d-md-block'
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
          onClick={handleDeleteMassive}
          disabled={selectedProducts.length === 0}
        >
          Eliminar
        </Button>
      </div>
      <div>
        <table
          className='table align-middle mt-4'
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead>
            <tr>
              <th scope='col' className='d-none d-md-table-cell col-1'></th>
              <th scope='col' className='col-2'>
                Imagen
              </th>
              <th scope='col' className='col-4 col-sm-3'>
                Nombre
              </th>
              <th scope='col' className='d-none d-lg-table-cell col-3'>
                Temporada
              </th>
              <th scope='col' className='col-4 col-sm-3'>
                Estatus
              </th>
              <th scope='col' className='d-none d-md-table-cell col-3'>
                Categoría
              </th>
              <th scope='col' className='d-none d-md-table-cell col-2'>
                Costo unitario
              </th>
              <th scope='col' className='d-none d-sm-table-cell col-3'>
                Última actualización
              </th>
              <th scope='col' className='col-2'></th>
            </tr>
          </thead>
          <tbody>{filteredProducts.map(item => product(item))}</tbody>
        </table>
      </div>

      <nav
        aria-label='Page navigation'
        className='d-flex justify-content-center justify-content-md-end'
      >
        <ul className='pagination'>
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
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center text-success'>Producto eliminado</h2>
          <p className='text-center'>
            El producto fue eliminado correctamente.
          </p>

          <div className='text-center mt-4'>
            <Button variant='success' onClick={handleCloseModal}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Este producto está marcado como <strong>Descontinuado</strong>.
          <br />
          Esta acción <strong>no se puede deshacer</strong>. ¿Deseas eliminarlo
          permanentemente?
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseConfirmModal}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={confirmHardDelete}>
            Sí, eliminar permanentemente
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ProductsData
