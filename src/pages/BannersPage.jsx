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
  const [deleteModal, setDeleteModal] = useState(false)
  const [showRestoreUpdate, setShowRestoreUpdate] = useState(false)
  const [showBannerModal, setShowBannerModal] = useState(false)
  const [showUploadBanner, setShowUploadBanner] = useState(false)
  const [showEditBanner, setShowEditBanner] = useState(false)
  const [savedOrder, setSavedOrder] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [bannerToEdit, setBannerToEdit] = useState(null)
  const handleCloseSavedOrder = () => setSavedOrder(false)
  const handleCloseModal = () => setShowModal(false)
  const handleCloseDeleteModal = () => setDeleteModal(false)
  const handleCloseRestoreUpdate = () => setShowRestoreUpdate(false)
  const handleCloseConfirmModal = () => setShowConfirmModal(false)
  const handleCloseBannerModal = () => {
    setShowBannerModal(false), setShowEditBanner(false)
  }
  const handleCloseRestoreModal = () => setShowRestoreModal(false)
  const handleCloseHardDeleteModal = () => setshowHardDeleteModal(false)
  const handleCloseUploadBanner = () => setShowUploadBanner(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showHardDeleteModal, setshowHardDeleteModal] = useState(false)
  const [draggedBanner, setDraggedBanner] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [bannerToRestore, setBannerToRestore] = useState(null)
  const [destinationType, setDestinationType] = useState('')
  const [destinationName, setDestinationName] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [seasons, setSeasons] = useState([])
  const [path, setPath] = useState('')
  const [selectedImage, setSelectedImage] = useState([])
  const [bannerToHardDelete, setBannerToHardDelete] = useState(null)
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  useEffect(() => {
    axios
      .get('https://banannylandapp.onrender.com/banners/all')
      .then(response => setBanners(response.data.banners))
      .catch(error => console.error('Error al obtener los banners:', error))
  }, [])

  const handleDeactivate = async _id => {
    if (!_id) return

    setBannerToDelete(_id)
    setShowConfirmModal(true)
    return
  }

  const confirmDelete = async () => {
    console.log(bannerToDelete)
    try {
      await axios.delete(
        `https://banannylandapp.onrender.com/banners/${bannerToDelete}`
      )
      setShowConfirmModal(false)
      setShowModal(true)
      setTimeout(() => reloadPage(), 3000)
    } catch (error) {
      console.error('Error al desactivar el producto:', error)
    }
  }

  const handleHardDelete = async _id => {
    if (!_id) return

    setBannerToHardDelete(_id)
    setshowHardDeleteModal(true)
    return
  }

  const confirmHardDelete = async () => {
    console.log(bannerToHardDelete)
    try {
      await axios.delete(
        `https://banannylandapp.onrender.com/banners/${bannerToHardDelete}/hardDelete`
      )
      setshowHardDeleteModal(false)
      setDeleteModal(true)
      setTimeout(() => reloadPage(), 3000)
    } catch (error) {
      console.error('Error al hacer hardDelete:', error)
    }
  }

  const uploadBanner = async () => {
    setShowBannerModal(true)
  }

  const handleRestore = async (_id, status) => {
    if (!_id) return

    if (status === 'Invalida') {
      setBannerToRestore(_id)
      setShowRestoreModal(true)
      return
    }
  }

  const confirmRestore = async () => {
    console.log(bannerToRestore)
    try {
      await axios.put(
        `https://banannylandapp.onrender.com/banners/${bannerToRestore}`,
        {
          status: 'Valida'
        }
      )
      setShowRestoreModal(false)
      setShowRestoreUpdate(true)
      setTimeout(() => reloadPage(), 3000)
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
    }
  }

  const reloadPage = () => {
    window.location.reload()
  }

  const handleDrop = async index => {
    if (draggedBanner === null || draggedBanner === index) return

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
      setSavedOrder(true)
      setTimeout(() => reloadPage(), 3000)
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
      setSelectedImage(uploadedImages[0])
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
    const newPath = buildPath(destinationType, name)
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
    if (!type || !name) return ''
    switch (type) {
      case 'producto': {
        const product = products.find(p => p.name === name)
        return product ? `/producto/${encodeURIComponent(product.slug)}` : ''
      }
      case 'categoría': {
        const category = categories.find(c => c.name === name)
        return category
          ? `/search?category=${encodeURIComponent(category.name)}`
          : ''
      }
      case 'temporada': {
        const season = seasons.find(s => s.name === name)
        return season ? `/seasons/${encodeURIComponent(season.name)}` : ''
      }
      default:
        return ''
    }
  }

  const handleSaveBanner = async () => {
    console.log(images[0].url, path)
    if (!destinationType || !destinationName || !selectedImage) {
      alert('Por favor, completa todos los campos y selecciona una imagen.')
      return
    }

    try {
      await axios.post('https://banannylandapp.onrender.com/banners', {
        image: images[0].url,
        path: path
      })
      console.log('Banner guardado exitosamente')
    } catch (error) {
      console.error('Error al guardar o actualizar el banner:', error)
    }

    handleCloseBannerModal()
    setDestinationType('')
    setDestinationName('')
    setPath('')
    setSelectedImage(null)
    setShowUploadBanner(true)
    setTimeout(() => reloadPage(), 3000)
  }

  const handleOpenBanner = async banner => {
    if (!banner) return
    console.log(banner)
    setBannerToEdit(banner)
    setPath(banner.path)
    setSelectedImage({ url: banner.image })
    setShowEditBanner(true)
  }

  const handleEditBanner = async () => {
    console.log(bannerToEdit)
    if (!bannerToEdit || !bannerToEdit._id) return
    try {
      await axios.put(
        `https://banannylandapp.onrender.com/banners/${bannerToEdit._id}`,
        {
          image: selectedImage?.url || bannerToEdit.image,
          path: path
        }
      )
      console.log('Banner modificado exitosamente')
    } catch (error) {
      console.error('Error al modificar el banner:', error)
    }
    handleCloseBannerModal()
    setDestinationType('')
    setDestinationName('')
    setPath('')
    setSelectedImage(null)
    setTimeout(() => reloadPage(), 3000)
  }

  useEffect(() => {
    axios
      .get('https://banannylandapp.onrender.com/products', {
        params: { limit: 100 }
      })
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

  const moveBannerUp = index => {
    if (index === 0) return
    console.log(index)
    const newBanners = [...banners]
    ;[newBanners[index - 1], newBanners[index]] = [
      newBanners[index],
      newBanners[index - 1]
    ]
    setBanners(newBanners)
  }

  const moveBannerDown = index => {
    if (index === banners.length - 1) return
    console.log(index)
    const newBanners = [...banners]
    ;[newBanners[index + 1], newBanners[index]] = [
      newBanners[index],
      newBanners[index + 1]
    ]
    setBanners(newBanners)
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
              className={`card mx-lg-auto col-lg-10 ${
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
                <div className='d-flex flex-column justify-content-center align-items-center p-3 col-md-7 col-xl-8'>
                  <img
                    src={getResizedCloudinaryUrl(
                      banner.image,
                      'c_fill,w_1919,h_718,g_auto'
                    )}
                    alt='Banner'
                    className='card-img object-fit-cover w-100'
                  />
                  <div className='d-none d-md-flex d-xl-none justify-content-center gap-2 pt-2'>
                    <i
                      className='bi bi-arrow-up-square fs-4 text-primary'
                      onClick={() => moveBannerUp(index)}
                      disabled={index === 0}
                    ></i>
                    <i
                      className='bi bi-arrow-down-square fs-4 text-primary'
                      onClick={() => moveBannerDown(index)}
                      disabled={index === banners.length - 1}
                    ></i>
                  </div>
                </div>
                <div className='d-flex align-items-center p-3 pt-0 pt-md-3 ps-lg-0 col-md-5 col-xl-4'>
                  <div className='card-body p-0'>
                    <p className='mb-1'>
                      <strong>Ruta:</strong> {banner.path}
                    </p>
                    <p className='mb-1'>
                      <strong>Status:</strong> {banner.status}
                    </p>

                    <div className='d-flex d-md-block d-lg-flex justify-content-evenly justify-content-lg-start gap-2'>
                      <button
                        className='btn btn-outline-success me-md-2 m-lg-0'
                        onClick={() => handleOpenBanner(banner)}
                      >
                        Modificar
                      </button>
                      <button
                        className='btn btn-outline-primary'
                        onClick={() =>
                          handleDeactivate(banner._id, banner.status)
                        }
                      >
                        Desactivar
                      </button>
                      <button
                        className='btn btn-outline-danger mt-md-2 mt-lg-0'
                        onClick={() =>
                          handleHardDelete(banner._id, banner.status)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className='d-flex d-md-none justify-content-center gap-2 pt-2'>
                      <i
                        className='bi bi-arrow-up-square fs-4 text-primary'
                        onClick={() => moveBannerUp(index)}
                        disabled={index === 0}
                      ></i>
                      <i
                        className='bi bi-arrow-down-square fs-4 text-primary'
                        onClick={() => moveBannerDown(index)}
                        disabled={index === banners.length - 1}
                      ></i>
                    </div>
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
            <div key={banner._id} className='card mx-lg-auto col-lg-10'>
              <div className='row mx-0'>
                <div className='d-flex flex-column justify-content-center align-items-center p-3 col-md-7 col-xl-8'>
                  <img
                    src={getResizedCloudinaryUrl(
                      banner.image,
                      'e_grayscale,c_fill,w_1919,h_718,g_auto'
                    )}
                    alt='Banner'
                    className='card-img object-fit-cover w-100'
                  />
                </div>
                <div className='d-flex align-items-center p-3 pt-0 pt-md-3 ps-lg-0 col-md-5 col-xl-4'>
                  <div className='card-body p-0'>
                    <p className='mb-1'>
                      <strong>Ruta:</strong> {banner.path}
                    </p>
                    <p className='mb-1'>
                      <strong>Status:</strong> {banner.status}
                    </p>

                    <div className='d-flex gap-2'>
                      <button
                        className='btn btn-outline-success'
                        onClick={() => handleRestore(banner._id, banner.status)}
                      >
                        Reactivar
                      </button>
                      <button
                        className='btn btn-outline-danger'
                        onClick={() =>
                          handleHardDelete(banner._id, banner.status)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
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
        show={savedOrder}
        onHide={handleCloseSavedOrder}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center text-success'>Orden guardado</h2>
          <p className='text-center'>
            El orden de los banners se ha guardado correctamente.
          </p>

          <div className='text-center mt-4'>
            <Button variant='success' onClick={reloadPage}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center text-success'>Banner desactivado</h2>
          <p className='text-center'>
            El banner ha cambiado de estatus correctamente.
          </p>

          <div className='text-center mt-4'>
            <Button variant='success' onClick={reloadPage}>
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
        show={showHardDeleteModal}
        onHide={handleCloseHardDeleteModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Este banner será eliminado</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseHardDeleteModal}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={confirmHardDelete}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={deleteModal}
        onHide={handleCloseDeleteModal}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center text-success'>Banner eliminado</h2>
          <p className='text-center'>
            El banner ha sido eliminado correctamente.
          </p>

          <div className='text-center mt-4'>
            <Button variant='success' onClick={reloadPage}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showRestoreModal} onHide={handleCloseRestoreModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reactivar Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Este banner pasará al estatus de <strong>Activo</strong>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseRestoreModal}>
            Cancelar
          </Button>
          <Button variant='success' onClick={confirmRestore}>
            Sí, cambiar estatus
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showRestoreUpdate}
        onHide={handleCloseRestoreUpdate}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center text-success'>Banner reactivado</h2>
          <p className='text-center'>
            El banner se ha reactivado correctamente.
          </p>

          <div className='text-center mt-4'>
            <Button variant='success' onClick={reloadPage}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
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
          <DropdownButton
            id='dropdown-destination-name'
            title={destinationName || 'Selecciona nombre'}
            onSelect={handleDestinationNameSelect}
            variant='light border border-2'
          >
            {getOptionsByType().map((option, index) => (
              <Dropdown.Item key={index} eventKey={option}>
                {option}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <input
            type='file'
            accept='image/*'
            className='form-control mt-4'
            onChange={e => uploadImages(e.target.files)}
            disabled={loading}
          />
          <div className='text-center mt-4'>
            <Button
              variant='success'
              onClick={handleSaveBanner}
              className='me-2'
            >
              Guardar
            </Button>
            <Button variant='danger' onClick={handleCloseBannerModal}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showUploadBanner}
        onHide={handleCloseUploadBanner}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center text-success'>Banner añadido</h2>
          <p className='text-center'>El banner se ha añadido correctamente.</p>

          <div className='text-center mt-4'>
            <Button variant='success' onClick={reloadPage}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditBanner}
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
          <DropdownButton
            id='dropdown-destination-name'
            title={destinationName || 'Selecciona nombre'}
            onSelect={handleDestinationNameSelect}
            variant='light border border-2'
          >
            {getOptionsByType().map((option, index) => (
              <Dropdown.Item key={index} eventKey={option}>
                {option}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <input
            type='file'
            accept='image/*'
            className='form-control mt-4'
            onChange={e => uploadImages(e.target.files)}
            disabled={loading}
          />
          <div className='text-center mt-4'>
            <Button
              variant='success'
              onClick={handleEditBanner}
              className='me-2'
            >
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
