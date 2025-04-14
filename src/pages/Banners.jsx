import { useEffect, useState } from 'react'
import axios from 'axios'

const Banners = () => {
    const [banners, setBanners] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [selectedForHome, setSelectedForHome] = useState([])
  
    // Cargar banners desde la API
    useEffect(() => {
      axios
        .get('https://banannylandapp.onrender.com/banners')
        .then(res => setBanners(res.data.banners)) // Aquí accedemos al array real
        .catch(err => console.error('Error al obtener los banners:', err))
    }, [])
  
    // Subir banner
    const handleUpload = async () => {
      if (!selectedFile) return
  
      const formData = new FormData()
      formData.append('image', selectedFile)
  
      try {
        await axios.post('https://banannylandapp.onrender.com/banners', formData)
        alert('Banner subido exitosamente')
        window.location.reload() // Recargar para ver el nuevo banner
      } catch (err) {
        console.error('Error al subir el banner:', err)
      }
    }
  
    // Eliminar banner
    const handleDelete = async (id) => {
      try {
        await axios.delete(`https://banannylandapp.onrender.com/banners/${id}`)
        alert('Banner eliminado')
        setBanners(banners.filter(b => b._id !== id))
      } catch (err) {
        console.error('Error al eliminar el banner:', err)
      }
    }
  
    // Cambiar selección para la página de inicio
    const toggleSelection = (id) => {
      setSelectedForHome(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    }
  
    return (
      <div className='container py-4'>
        <h2>Administrar Banners</h2>
  
        <div className='mb-4'>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button className='btn btn-primary mt-2' onClick={handleUpload}>
            Subir Banner
          </button>
        </div>
  
        <div className='row'>
          {banners.map((banner) => (
            <div key={banner._id} className='col-md-4 mb-4'>
              <div className='card'>
                <img
                  src={banner.image}
                  alt='Banner'
                  className='card-img-top'
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <div className='card-body'>
                  <p><strong>Ruta:</strong> {banner.path}</p>
                  <p><strong>Status:</strong> {banner.status}</p>
  
                  <div className='form-check'>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={`select-${banner._id}`}
                      checked={selectedForHome.includes(banner._id)}
                      onChange={() => toggleSelection(banner._id)}
                    />
                    <label
                      htmlFor={`select-${banner._id}`}
                      className='form-check-label'
                    >
                      Mostrar en página de inicio
                    </label>
                  </div>
  
                  <button
                    className='btn btn-danger mt-2'
                    onClick={() => handleDelete(banner._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

export default Banners