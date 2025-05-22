import { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import axios from 'axios'
import { getResizedCloudinaryUrl } from '../../utils/tools'

const Banner = () => {
  const [content, setContent] = useState([])

  useEffect(() => {
    axios
      .get('https://banannylandapp.onrender.com/banners')
      .then(res => {
        const filteredBanners = res.data.banners.filter(
          b => b.status === 'Valida'
        )
        setContent(filteredBanners)
      })
      .catch(err => console.error('Error al cargar los banners:', err))
  }, [])

  if (!content) return <div>Loading...</div>

  return (
    <div className='position-relative overflow-hidden'>
      <Carousel
        id='Bannercarousel'
        className='z-0 d-flex position-relative w-100 top-0 start-0'
        style={{ gridColumn: '1 / 1', gridRow: '1 / 1' }}
        fade
        indicators={false}
        controls={false}
      >
        {content.map((banner, index) => (
          <Carousel.Item key={index} className='d-block w-100'>
            <a href={banner.path}>
              <img
                src={getResizedCloudinaryUrl(
                  banner.image,
                  'c_fill,w_1919,h_718,g_auto'
                )}
                alt=''
                className='d-block w-100'
                style={{
                  objectFit: 'cover'
                }}
              />
              <button
                className='carousel-control-prev justify-content-start'
                type='button'
                data-bs-target='#Bannercarousel'
                data-bs-slide='prev'
              >
                <span
                  className='carousel-control-prev-icon'
                  aria-hidden='true'
                />
                <span className='visually-hidden'>Previous</span>
              </button>
              <button
                className='carousel-control-next justify-content-end'
                type='button'
                data-bs-target='#Bannercarousel'
                data-bs-slide='next'
              >
                <span
                  className='carousel-control-next-icon'
                  aria-hidden='true'
                />
                <span className='visually-hidden'>Next</span>
              </button>
            </a>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}

export default Banner
