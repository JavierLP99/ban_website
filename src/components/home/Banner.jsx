import { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import axios from 'axios'

const Banner = () => {
  const [content, setContent] = useState([])

  useEffect(() => {
    axios
      .get('https://banannylandapp.onrender.com/banners')
      .then(res => {
        const filteredBanners = res.data.banners.filter(b => b.status === 'Valida')
        setContent(filteredBanners)
      })
      .catch(err => console.error('Error al cargar los banners:', err))
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
        {content.map((banner, index) => (
          <Carousel.Item key={index} className='d-block w-100 h-100'>
            <a href={banner.path}>
            <img
              src={banner.image}
              alt=''
              className='d-block w-100 h-50'
              style={{
                objectFit: 'cover'
              }}
            />
            </a>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}

export default Banner
