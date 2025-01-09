import { useEffect, useRef, useState } from 'react'
import { Carousel } from 'bootstrap'

const Categories = () => {
  const carouselRef1 = useRef(null)

  const [info, setInfo] = useState({ data: [] })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(1)

  useEffect(() => {
    fetch('/Sponsors.json')
      .then((response) => response.json())
      .then((data) => setInfo(data))
      .catch((error) => console.error('Error fetching JSON:', error))
  }, [])

  useEffect(() => {
    if (carouselRef1.current) new Carousel(carouselRef1.current)

    const updateItemsToShow = () => {
      const width = window.innerWidth
      if (width >= 992) setItemsToShow(3)
      else if (width >= 768) setItemsToShow(2)
      else setItemsToShow(1)
    }

    updateItemsToShow()
    window.addEventListener('resize', updateItemsToShow)

    return () => window.removeEventListener('resize', updateItemsToShow)
  }, [])

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + itemsToShow) % info.data.length
    )
  }

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - itemsToShow + info.data.length) % info.data.length
    )
  }

  const ImportDrivePhoto = (driveUrl, height) => {
    const defaultUrl =
      'https://drive.google.com/file/d/1Q7By_xG9r3a8Zr47j6b1HG7yAm91GIHO/view?usp=drive_link'

    const match = driveUrl.match(/\/d\/(.*)\//)
    const fileId = match ? match[1] : defaultUrl.match(/\/d\/(.*)\//)[1]

    return `https://lh3.googleusercontent.com/d/${fileId}=h${height}`
  }

  if (!info.data.length) return <div>Loading...</div>

  const renderCard = (data, className) => (
    <div className={`card bg-white rounded col-11 ${className}`}>
      <div className='d-flex flex-column'>
        <div className='ratio ratio-1x1'>
          <img
            src={ImportDrivePhoto(data.imagesecond, 600)}
            className='object-fit-cover w-100 h-100 rounded-top'
            alt={data.name}
          />
        </div>
        <div className='card-body d-flex flex-column'>
          <div className='d-flex flex-column'>
            <div className='pt-3'>
              <a
                href=''
                className='btn btn-outline-primary rounded mx-auto my-1'
                target='_blank'
                rel='noopener noreferrer'
              >
                <h4>Nombre del proyecto</h4>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section className='h-full py-5'>
      <h2 className='fw-bold text-center text-primary mb-4'>Categorías</h2>
      <div className='row mx-0 justify-content-center align-items-center'>
        <div className='text-center col-12 col-md-6 col-lg-10 my-5 my-lg-0 position-relative'>
          <div
            id='opinioncarousel'
            className='carousel carousel-dark justify-content-center'
            ref={carouselRef1}
          >
            <div className='carousel-inner'>
              <div className='carousel-item active'>
                <div className='row justify-content-center'>
                  {Array.from({ length: itemsToShow }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`d-flex justify-content-center align-items-center col-${12 / itemsToShow}`}
                    >
                      {renderCard(info.data[(currentIndex + idx) % info.data.length], '')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              className='carousel-control-prev position-absolute start-0 translate-middle-y'
              type='button'
              data-bs-target='#opinioncarousel'
              onClick={handlePrev}
              style={{ left: '-50px' }}
            >
              <span
                className='carousel-control-prev-icon'
                aria-hidden='true'
              />
              <span className='visually-hidden'>Previous</span>
            </button>
            <button
              className='carousel-control-next position-absolute end-0 translate-middle-y'
              type='button'
              data-bs-target='#opinioncarousel'
              onClick={handleNext}
              style={{ right: '-50px' }}
            >
              <span
                className='carousel-control-next-icon'
                aria-hidden='true'
              />
              <span className='visually-hidden'>Next</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Categories
