import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import { Modal } from 'react-bootstrap'
import { getResizedCloudinaryUrl } from '../utils/tools'

const BannersPage = (imageTag = 'gallery') => {
  const [banners, setBanners] = useState([])
  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => setShowModal(false)
  const handleCloseConfirmModal = () => setShowConfirmModal(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [draggedBanner, setDraggedBanner] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [images, setImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bannerToDelete, setBannerToDelete] = useState(null)
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

  const confirmDelete = async (_id)  => {
    console.log(bannerToDelete)
    try {
      await axios.delete(`https://banannylandapp.onrender.com/banners/${bannerToDelete}`)
      setShowConfirmModal(false)
      setShowModal(true)
      setBanners(banners.filter(banner => banner._id !== _id))
      setTimeout(() => setShowModal(false), 5000)
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
    try {
      const uploadedImages = await Promise.all(
        [...files].map(async file => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('upload_preset', uploadPreset)
          formData.append('tags', imageTag)

          const res = await fetch(
            `https://banannylandapp.onrender.com/banners/upload`,
            { method: 'POST', body: formData }
          )

          const data = await res.json()
          return { url: data.secure_url, public_id: data.public_id }
        })
      )

      setImages(prevImages => [...uploadedImages, ...prevImages])
    } catch {
      setError('Error cargando imagen.')
    } finally {
      setLoading(false)
    }
  }

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
    .map((banner, index) => (
      <div
        key={banner._id}
        className='card mx-auto col-6'
      >
        <div className='row mx-0'>
          <div className='col-md-8 d-flex align-items-center'>
            <img
              src={getResizedCloudinaryUrl(banner.image,"e_grayscale")}
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
      <input
        type='file'
        multiple
        accept='image/*'
        className='form-control mt-4'
        onChange={e => uploadImages(e.target.files)}
        disabled={loading}
      />
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
    </div>
  )
}

export default BannersPage
