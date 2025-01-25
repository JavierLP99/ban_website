import { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'

const Categories = () => {
  const [groupSize, setGroupSize] = useState(getInitialGroupSize())

  const movies = [
    {
      id: 1,
      title: 'Categoría 1',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 2,
      title: 'Categoría 2',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 3,
      title: 'Categoría 3',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 4,
      title: 'Categoría 4',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 5,
      title: 'Categoría 5',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 6,
      title: 'Categoría 2',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 7,
      title: 'Categoría 3',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 8,
      title: 'Categoría 4',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 9,
      title: 'Categoría 5',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 10,
      title: 'Categoría 2',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 11,
      title: 'Categoría 3',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 12,
      title: 'Categoría 4',
      image: 'https://placehold.co/600x400/EEE/31343C'
    },
    {
      id: 13,
      title: 'Categoría 5',
      image: 'https://placehold.co/600x400/EEE/31343C'
    }
  ]

  function getInitialGroupSize () {
    if (window.innerWidth >= 1024) return 6
    if (window.innerWidth >= 768) return 4
    if (window.innerWidth >= 576) return 3
    return 2
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setGroupSize(6)
      else if (window.innerWidth >= 768) setGroupSize(4)
      else if (window.innerWidth >= 576) setGroupSize(3)
      else setGroupSize(2)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const groupCards = (cards, groupSize) => {
    const grouped = []
    for (let i = 0; i < cards.length; i += groupSize - 1) {
      grouped.push(cards.slice(i, i + groupSize - 1))
    }
    return grouped
  }

  const groupedCards = groupCards(movies, groupSize)

  return (
    <div className='container text-center d-flex flex-column align-items-center justify-content-center my-4'>
      <h2 className='fw-bold mb-3'>Categorías</h2>
      <div className='rainbow-divider mb-3'></div>{' '}
      {/* Rainbow divider below the header */}
      <Carousel interval={null} indicators={false} className='w-100' prevIcon={<i className="bi bi-caret-left-fill text-primary h1 fw-bold"></i>} nextIcon={<i className="bi bi-caret-right-fill text-primary h1 fw-bold"></i>}>
        {groupedCards.map((group, idx) => (
          <Carousel.Item key={idx}>
            <div className='d-flex justify-content-center'>
              {group.map(item => (
                <div
                  key={item.id}
                  className={`p-3 p-lg-4 col-${12 / groupSize}`}
                >
                  <div
                    className='ratio ratio-1x1 rounded rounded-5'
                    style={{ overflow: 'hidden' }}
                  >
                    <a href='#'>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          objectFit: 'cover', // Ensures the image fills the container properly
                          width: '100%', // Ensures full width
                          height: '100%' // Ensures full height
                        }}
                      />
                    </a>
                  </div>
                  <p className='text-center mt-2'>{item.title}</p>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}

      </Carousel>
    </div>
  )
}

export default Categories
