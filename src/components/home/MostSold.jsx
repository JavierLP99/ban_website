import { useState, useEffect } from 'react'

const MostSold = () => {
  const [content, setContent] = useState([])

  useEffect(() => {
    fetch('/products.json') // Adjust the path as needed
      .then(response => response.json())
      .then(data => setContent(data.products))
      .catch(error => console.error('Error loading content:', error))
  }, [])

  const ImportDrivePhoto = (driveUrl, height) => {
    const defaultUrl =
      'https://drive.google.com/file/d/1Q7By_xG9r3a8Zr47j6b1HG7yAm91GIHO/view?usp=drive_link'

    const match = driveUrl.match(/\/d\/(.*)\//)
    const fileId = match ? match[1] : defaultUrl.match(/\/d\/(.*)\//)[1]

    const newUrl = `https://lh3.googleusercontent.com/d/${fileId}=h${height}`

    return newUrl
  }

  const card = (item, index) => (
    <div key={index} className='row justify-content-center rounded-4 lights1 p-2 mx-0 mb-4 col-3'>
      <div className='d-flex justify-content-center px-0'>
        <div className='card rounded-4 col-12'>
          <a href={`/producto/${item.name}`}>
            <div className='ratio ratio-1x1'>
              <div className='d-flex justify-content-center align-items-center'>
                <img
                  src={item.images[0]}
                  className='img-fluid rounded-top-4 h-100 w-100 object-fit-cover'
                  alt='Imagen principal'
                />
              </div>
            </div>
            <div className='ratio ratio-21x9'>
              <div className='card-body d-flex flex-column py-2'>
                <h6 className='card-title'>{item.name}</h6>
                <p className='card-subtitle'>{item.price.stock}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div className='py-5'>
      <div className='container text-center d-flex flex-column align-items-center'>
        <h2 className='fw-bold mb-3'>Los más vendidos</h2>
        <div className='rainbow-divider mb-3'></div>
      </div>
      <div className='row justify-content-center'>
        <p className='text-justify col-5'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div className='d-flex justify-content-center'>
        <a href='#' className='btn btn-light btn-outline-dark rounded-5'>
          Ver todos los productos
        </a>
      </div>
      <div className='row justify-content-center mx-auto mt-4 col-8'>
        {content.map((item, index) => card(item, index))}
      </div>
    </div>
  )
}

export default MostSold
