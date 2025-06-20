import { useState, useEffect } from 'react'
import axios from 'axios'

const MostSold = () => {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(
        'https://banannylandapp.onrender.com/products?page=1&limit=8&sortBy=updatedAt&order=desc'
      )
      .then(response => {
        setContent(response.data.products)
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
  }, [])

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

  const card = item => (
    <div
      key={item.id}
      className='mb-4 col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3'
    >
      <div className='d-flex rounded-4 lights h-100 p-3'>
        <div className='card rounded-4 w-100'>
          <a href={`/producto/${item.slug}`}>
            <div className='ratio ratio-1x1'>
              <div className='d-flex justify-content-center align-items-center'>
                <img
                  src={item.images[0]}
                  className='img-fluid rounded-top-4 h-100 w-100 object-fit-cover'
                  alt={item.name}
                />
              </div>
            </div>
            <div className='ratio ratio-21x9 text-dark'>
              <div className='d-flex align-items-center'>
                <div className='card-body d-flex flex-column py-2'>
                  <h3 className='card-title'>{item.name}</h3>
                  <p className='card-subtitle'>$ {item.referencePrice}</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div className='py-5 most-sold-products-section'>
      <div className='container text-center d-flex flex-column align-items-center'>
        <div className='d-inline-block'>
          <h2 className='fw-bold mb-3'>Populares en Banannyland</h2>
          <div className='rainbow-divider mx-auto'></div>
        </div>
        <div className='row justify-content-center'>
          <p className='text-justify mb-5 col-10 col-5'>
            Dale un vistazo a nuestros productos más vendidos y llévatelos antes
            de que se acaben.
          </p>
        </div>
        <div className='row justify-content-center col-12'>
          {content.map(item => card(item))}
        </div>
        <a href='/search' className='btn btn-light btn-outline-dark rounded-5'>
          Ver todos los productos
        </a>
      </div>
    </div>
  )
}

export default MostSold
