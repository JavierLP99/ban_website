import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import { Modal } from 'react-bootstrap'
import { getResizedCloudinaryUrl } from '../utils/tools'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

const BannersPage = () => {
  const [banners, setBanners] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showBannerModal, setShowBannerModal] = useState(false)
  const handleCloseModal = () => setShowModal(false)
  const handleCloseConfirmModal = () => setShowConfirmModal(false)
  const handleCloseBannerModal = () => setShowBannerModal(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [draggedBanner, setDraggedBanner] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [destinationType, setDestinationType] = useState('')
  const [destinationName, setDestinationName] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [seasons, setSeasons] = useState([])
  const [selectedType, setSelectedType] = useState('Selecciona tipo')
  const [path, setPath] = useState('')
  const [selectedImage, setSelectedImage] = useState([])
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  useEffect(() => {
    axios
      .get('https://banannylandapp.onrender.com/banners/all')
      .then(response => setBanners(response.data.banners))
      .catch(error => console.error('Error al obtener los banners:', error))
  }, [])

  const handleDelete = async (_id, status) => {
    if (!_id) return

    if (status === 'Valida') {
      setBannerToDelete(_id)
      setShowConfirmModal(true)
      return
    }
  }

  const uploadBanner = async () => {
    setShowBannerModal(true)
  }

  const confirmDelete = async _id => {
    console.log(bannerToDelete)
    try {
      await axios.delete(
        `https://banannylandapp.onrender.com/banners/${bannerToDelete}`
      )
      setShowConfirmModal(false)
      setShowModal(true)
      setBanners(banners.filter(banner => banner._id !== _id))
      setTimeout(() => setShowModal(false), 5000)
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
    }
  }

  const restore = async _id => {
    console.log(_id)
    try {
      await axios.put(`https://banannylandapp.onrender.com/banners/${_id}`, {
        status: 'Valida'
      })
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
    }
  }

  const handleDrop = async index => {
    if (draggedBanner === null) return

    const bannersCopy = [...banners]
    const draggedItem = bannersCopy[draggedBanner]

    bannersCopy.splice(draggedBanner, 1)
    bannersCopy.splice(index, 0, draggedItem)

    setBanners(bannersCopy)
    setDraggedBanner(null)
  }

  const saveReorder = async () => {
    const bannersID = banners.map(banner => banner._id)

    try {
      await axios.put('https://banannylandapp.onrender.com/banners/reorder', {
        ids: bannersID
      })
      console.log('Orden guardado exitosamente')
    } catch (error) {
      console.error('Error al guardar el orden:', error)
    }
  }

  const uploadImages = async files => {
    setLoading(true)
    console.log(files)
    try {
      const uploadedImages = await Promise.all(
        [...files].map(async file => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('upload_preset', uploadPreset)
          formData.append('tags', 'banners')

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            { method: 'POST', body: formData }
          )

          const data = await res.json()
          return { url: data.secure_url, public_id: data.public_id }
        })
      )

      setImages(uploadedImages)
    } catch {
      setError('Error cargando imagen.')
    } finally {
      setLoading(false)
    }
  }

  const handleDestinationTypeSelect = type => {
    setDestinationType(type)
    setDestinationName('')
    setPath('')
  }

  const handleDestinationNameSelect = name => {
    setDestinationName(name)
    const newPath = buildPath(destinationType, name);
    setPath(newPath)
  }

  const getOptionsByType = () => {
    switch (destinationType) {
      case 'producto':
        return products.map(product => product.name)
      case 'categoría':
        return categories.map(category => category.name)
      case 'temporada':
        return seasons.map(season => season.name)
      default:
        return []
    }
  }

  const buildPath = (type, name) => {
    if (!type || !name) return '';
    switch (type) {
      case 'producto': {
        const product = products.find(p => p.name === name);
        return product ? `/products/${encodeURIComponent(product.slug)}` : '';
      }
      case 'categoría':
        {
          const category = categories.find(c => c.name === name);
          return category ? `/categories/${encodeURIComponent(category.slug)}` : '';
        }
      case 'temporada':
        {
          const season = seasons.find(s => s.name === name);
          return season ? `/seasons/${encodeURIComponent(season.slug)}` : '';
        }
      default:
        return '';
    }
  }

  const handleSaveBanner = async () => {
    console.log(images[0].url,path)
    if (!destinationType || !destinationName || !selectedImage) {
      alert('Por favor, completa todos los campos y selecciona una imagen.');
      return;
    }
    try {
      await axios.post('https://banannylandapp.onrender.com/banners', {
        image:images[0].url, path:path
      })
      console.log('Banner guardado exitosamente')
    } catch (error) {
      console.error('Error al guardar el banner:', error)
    }


  handleCloseBannerModal();
  setDestinationType('');
  setDestinationName('');
  setPath('');
  setSelectedImage(null);
}

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        console.log(`We try with banner`)
        const response = await axios.get(
          `https://res.cloudinary.com/${cloudName}/image/list/banner.json`
        )

        const data = response.data
        if (data.resources) {
          setImages(
            data.resources.map(img => ({
              url: `https://res.cloudinary.com/${cloudName}/image/upload/${img.public_id}`,
              public_id: img.public_id
            }))
          )
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError('No se pudieron cargar las imágenes.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [cloudName])

  useEffect(() => {
    axios
      .get('https://banannylandapp.onrender.com/products', { params: {limit:100}})
      .then(response => setProducts(response.data.products))
      .catch(error => console.error('Error al obtener productos:', error))

    axios
      .get('https://banannylandapp.onrender.com/categories')
      .then(response => setCategories(response.data.categories))
      .catch(error => console.error('Error al obtener categorías:', error))

    axios
      .get('https://banannylandapp.onrender.com/seasons')
      .then(response => setSeasons(response.data.seasons))
      .catch(error => console.error('Error al obtener temporadas:', error))
  }, [])

  return (
    <div className='container py-4'>
      <h2>Administrar Banners</h2>
      <h5 className='text-center my-4'>Banners activos</h5>
      <div className='d-flex flex-column'>
        {banners
          .filter(banner => banner.status === 'Valida')
          .map((banner, index) => (
            <div
              key={banner._id}
              className={`card mx-auto col-6 ${
                index === draggedBanner ? 'dragging' : ''
              } ${index === dragOverIndex ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => setDraggedBanner(index)}
              onDragOver={e => {
                e.preventDefault()
                setDragOverIndex(index)
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => {
                setDraggedBanner(null)
                setDragOverIndex(null)
              }}
            >
              <div className='row mx-0'>
                <div className='col-md-8 d-flex align-items-center'>
                  <img
                    src={banner.image}
                    alt='Banner'
                    className='card-img object-fit-cover w-100'
                  />
                </div>
                <div className='col-md-4'>
                  <div className='card-body'>
                    <p className='mb-1'>
                      <strong>Ruta:</strong> {banner.path}
                    </p>
                    <p className='mb-1'>
                      <strong>Status:</strong> {banner.status}
                    </p>
                    <button
                      className='btn btn-danger'
                      onClick={() => handleDelete(banner._id, banner.status)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <button className='btn btn-success my-3' onClick={saveReorder}>
        Guardar orden
      </button>
      <h5 className='text-center my-4'>Banners inactivos</h5>

      <div className='d-flex flex-column'>
        {banners
          .filter(banner => banner.status == 'Invalida')
          .map(banner => (
            <div key={banner._id} className='card mx-auto col-6'>
              <div className='row mx-0'>
                <div className='col-md-8 d-flex align-items-center'>
                  <img
                    src={getResizedCloudinaryUrl(banner.image, 'e_grayscale')}
                    alt='Banner'
                    className='card-img object-fit-cover w-100'
                  />
                </div>
                <div className='col-md-4'>
                  <div className='card-body'>
                    <p className='mb-1'>
                      <strong>Ruta:</strong> {banner.path}
                    </p>
                    <p className='mb-1'>
                      <strong>Status:</strong> {banner.status}
                    </p>
                    <button
                      className='btn btn-danger'
                      onClick={() => restore(banner._id, banner.status)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <button className='btn btn-success my-3' onClick={() => uploadBanner()}>
        Añadir banner
      </button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center text-success'>Banner eliminado</h2>
          <p className='text-center'>El banner fue eliminado correctamente.</p>

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
          Este banner está marcado como <strong>Activo</strong>.
          <br />
          Pasará al estatus de <strong> Inactivo</strong>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseConfirmModal}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={confirmDelete}>
            Sí, cambiar estatus
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showBannerModal}
        onHide={handleCloseBannerModal}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <DropdownButton
            id='dropdown-destination-type'
            title={destinationType || 'Selecciona tipo'}
            onSelect={handleDestinationTypeSelect}
            variant='light border border-2'
            className='mb-3'
          >
            <Dropdown.Item eventKey='producto'>Producto</Dropdown.Item>
            <Dropdown.Item eventKey='categoría'>Categoría</Dropdown.Item>
            <Dropdown.Item eventKey='temporada'>Temporada</Dropdown.Item>
          </DropdownButton>
          {destinationType && (
        <DropdownButton
        id="dropdown-destination-name"
        title={destinationName || 'Selecciona nombre'}
        onSelect={handleDestinationNameSelect}
        variant="light border border-2"
      >
        {getOptionsByType().map((option, index) => (
          <Dropdown.Item key={index} eventKey={option}>
            {option}
          </Dropdown.Item>
        ))}
      </DropdownButton>
          )}
          <input
            type='file'
            accept='image/*'
            className='form-control mt-4'
            onChange={e => uploadImages(e.target.files)}
            disabled={loading}
          />
        <div className='text-center mt-4'>
          <Button variant='success' onClick={handleSaveBanner} className='me-2'>
            Guardar
          </Button>
          <Button variant='danger' onClick={handleCloseBannerModal}>
            Cerrar
          </Button>
        </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default BannersPage
