import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {getThumbnailUrl, getInvalid} from '../utils/tools'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [products, setProducts] = useState(null)
  const [referenceProduct, setReferenceProduct] = useState(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get('https://banannylandapp.onrender.com/categories/all', {
        params: { limit: 50 }
      })
      .then(response => setCategories(response.data.categories || []))
      .catch(error => console.error('Error fetching categories:', error))
      .finally(() => setLoading(false))
  }, [])

  const handleCategoryClick = category => {
    navigate(`/search?category=${category}`)
  }

  const updateCategory = async () => {
    const product = products.find(p => p._id === referenceProduct)
    if (!product || !product.images?.length) {
      setError('Invalid product or missing image.')
      return
    }

    try {
      await axios.put(
        `https://banannylandapp.onrender.com/categories/${selectedCategory._id}`,
        {
          linkedProduct: product._id,
          image: product.images[0]
        }
      )

      setMessage('Categoría actualizada!')
      
      setTimeout(() => window.location.reload(), 3000)
    } catch (err) {
      setError('Failed to update category.')
      console.log(err)
    }
  }


  
  const openModifyModal = category => {
    setSelectedCategory(category)
    fetchProductsByCategory(category)
    setShowModifyModal(true)
  }

  const closeModifyModal = () => {
    setSelectedCategory(null)
    setProducts(null)
    setShowModifyModal(false)
  }

  const openDeleteModal = category => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setSelectedCategory(null)
    setShowDeleteModal(false)
  }

  // Example API call inside useEffect or handler
  const fetchProductsByCategory = async category => {
    axios
      .get(`https://banannylandapp.onrender.com/products/all`, {
        params: { category: category.name, limit: 100 }
      })
      .then(response => {
        setProducts(response.data.products || [])
        setReferenceProduct(category.linkedProduct)
      })
      .catch(error => console.error('Error fetching products:', error))
  }

  const handleDeleteOrReactivate = async () => {
    try {
      if (selectedCategory.status === 'Valida') {
        await axios.delete(
          `https://banannylandapp.onrender.com/categories/${selectedCategory._id}`
        )
      } else {
        await axios.put(
          `https://banannylandapp.onrender.com/categories/${selectedCategory._id}`,
          {
            status: 'Valida'
          }
        )
      }
      window.location.reload()
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Error al actualizar la categoría.')
    }
  }

  const validCategories = categories.filter(cat => cat.status === 'Valida')
  const invalidCategories = categories.filter(cat => cat.status !== 'Valida')

  if (loading) return <p className='text-center'>Cargando categorías...</p>

  const renderCategoryCard = item => (
    <div
      key={item._id}
      className='p-3 p-lg-4 col-10 col-sm-6 col-lg-4 col-xl-3'
      onClick={() => handleCategoryClick(item.name)}
    >
      <div
        className='ratio ratio-1x1 rounded rounded-5'
        style={{ overflow: 'hidden' }}
      >
        <a href={`/search?category=${item.name}`}>
          <img
            src={item.status === 'Valida'? getThumbnailUrl(item.image) : getInvalid(item.image)}
            alt={item.name}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </a>
      </div>
      <p className='text-center mt-2 mx-1'>{item.name}</p>
      <div className='row gx-2 mt-2 gap-2 justify-content-center'>
        <div
          className='btn btn-primary col-5'
          onClick={e => {
            e.stopPropagation()
            openModifyModal(item)
          }}
        >
          Modificar
        </div>
        <div
          className={`btn ${
            item.status === 'Valida' ? 'btn-warning' : 'btn-success'
          } col-5`}
          onClick={e => {
            e.stopPropagation()
            openDeleteModal(item)
          }}
        >
          {item.status === 'Valida' ? 'Eliminar' : 'Reactivar'}
        </div>
      </div>
    </div>
  )

  return (
    <div className='container text-center d-flex flex-column align-items-center justify-content-center my-4'>
      <h1 className='fw-bold mb-3'>Gestión de Categorías</h1>
      <div className='rainbow-divider mb-3'></div>

      <h4 className='mb-3'>Categorías Activas</h4>
      <div className='d-flex justify-content-center flex-wrap w-100'>
        {validCategories.map(renderCategoryCard)}
      </div>

      {invalidCategories.length > 0 && (
        <>
          <h4 className='mt-5 mb-3'>Categorías Inactivas</h4>
          <div className='d-flex justify-content-center flex-wrap w-100'>
            {invalidCategories.map(renderCategoryCard)}
          </div>
        </>
      )}

      {/* Modify Modal */}
      {showModifyModal && selectedCategory && (
        <div className='modal fade show d-block' tabIndex='-1' role='dialog'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Modificar Categoría</h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={closeModifyModal}
                ></button>
              </div>
              <div className='modal-body'>
                <p>
                  <strong>Nombre:</strong> {selectedCategory.name}
                </p>
                <img
                  src={getThumbnailUrl(selectedCategory.image)}
                  alt='preview'
                  className='img-fluid rounded w-50'
                />
              </div>

              {products?.length > 0 && (
                <select
                  value={referenceProduct}
                  onChange={e => setReferenceProduct(e.target.value)}
                  className='p-1 rounded rounded-3 m-2'
                >
                  <option value=''>Selecciona un producto</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      🖼️ {product.name}
                    </option>
                  ))}
                </select>
              )}

              {message && <p className='text-success'>{message}</p>}
              {error && <p className='text-danger'>{error}</p>}

              <div className='modal-footer'>
                <button className='btn btn-success' onClick={updateCategory}>
                  Guardar
                </button>
                <button
                  className='btn btn-secondary'
                  onClick={closeModifyModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete/Reactivate Modal */}
      {showDeleteModal && selectedCategory && (
        <div className='modal fade show d-block' tabIndex='-1' role='dialog'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>
                  {selectedCategory.status === 'Valida'
                    ? 'Eliminar Categoría'
                    : 'Reactivar Categoría'}
                </h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={closeDeleteModal}
                ></button>
              </div>
              <div className='modal-body'>
                <p>
                  <strong>Nombre:</strong> {selectedCategory.name}
                </p>
                <img
                  src={getThumbnailUrl(selectedCategory.image)}
                  alt='preview'
                  className='img-fluid rounded'
                />
                <p className='mt-3'>
                  {selectedCategory.status === 'Valida'
                    ? '¿Estás seguro de que deseas eliminar esta categoría?'
                    : '¿Deseas reactivar esta categoría?'}
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  className='btn btn-secondary'
                  onClick={closeDeleteModal}
                >
                  Cancelar
                </button>
                <button
                  className={`btn ${
                    selectedCategory.status === 'Valida'
                      ? 'btn-warning'
                      : 'btn-success'
                  }`}
                  onClick={handleDeleteOrReactivate}
                >
                  {selectedCategory.status === 'Valida'
                    ? 'Eliminar'
                    : 'Reactivar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
