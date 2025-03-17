import { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'

const Banner = () => {
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/home.json') // Adjust the path as needed
      .then(response => response.json())
      .then(data => setContent(data.banner))
      .catch(error => console.error('Error loading content:', error))
  }, [])

  if (!content) return <div>Loading...</div>

  return (
    <div className='position-relative overflow-hidden'>
      <Carousel
        className='z-0 d-flex position-relative w-100 h-100 top-0 start-0'
        style={{ gridColumn: '1 / 1', gridRow: '1 / 1' }}
        fade
        indicators={false}
        controls={false}
      >
        {content.backgroundImages.map((image, index) => (
          <Carousel.Item key={index} className='d-block w-100 h-100'>
            <img
              src={image}
              alt=''
              className='d-block w-100 h-100'
              style={{
                objectFit: 'cover'
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Overlay Content */}
      <div
        className='z-2 d-flex flex-column justify-content-end justify-content-sm-start text-white h-100 position-absolute top-0 start-0 w-100'
        style={{ gridColumn: '1 / 1', gridRow: '1 / 1' }}
      >
        <div className='top-50 text-start w-100'>
          <div className='container-lg'>
            <h1 className='visually-hidden'>{content.title}</h1>
            <div className='text-start'>
              <p className='d-none d-sm-block m-0 lead display-3'>{content.description}</p>
            </div>
          </div>
        </div>

        <div className='d-flex justify-content-center align-items-start'>
          <div className='col-4'>
            <a
              href={content.buttonLink1}
              className='btn btn-light btn-outline-dark btn-lg rounded-5 mb-5 mb-sm-0'
            >
              <p className='m-0 x-small small'>{content.buttonText1}</p>
            </a>
          </div>
          <div className='d-flex justify-content-center col-4'>
            <a
              href={content.buttonLink2}
              className='btn btn-dark btn-outline-light btn-lg  rounded-5  mb-sm-0'
            >
              <p className='m-0 x-small small'>{content.buttonText2}</p>
            </a>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for Better Text Visibility */}
      <div
        className='z-1 position-absolute top-0 start-0 w-100 h-100'
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5))',
          zIndex: 1
        }}
      />
    </div>
  )
}

export default Banner
