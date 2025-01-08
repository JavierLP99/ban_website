import { useState, useEffect } from 'react'

const MostSold = () => {
  const [content, setContent] = useState([])

  useEffect(() => {
    fetch('/home.json') // Adjust the path as needed
      .then(response => response.json())
      .then(data => setContent(data.mostSold))
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
    <div key={index} className='col-2'>
      <div className='card'>
        <div className='ratio ratio-1x1'>
          <div className='row justify-content-center mx-auto'>
            <div className='h-100 w-auto border-bottom'>
              <img
                src={ImportDrivePhoto(item.image, 250)}
                className='col-12'
                alt='Imagen principal'
              />
            </div>
          </div>
        </div>
        <div className='ratio ratio-21x9'>
          <div className='card-body d-flex flex-column py-2'>
            <h5 className='card-title'>{item.article}</h5>
            <h6 className='card-subtitle'>{item.price}</h6>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='py-5'>
      <div className='text-center'>
        <h2 className='fw-semibold mb-4 text-dark'>Los más vendidos</h2>
      </div>
      <div className='row justify-content-center text-justify'>
        <p className='col-5'>
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
      <div className='row justify-content-center mt-4'>
        {content.map((item, index) => card(item, index))}
      </div>
    </div>
  )
}

export default MostSold
