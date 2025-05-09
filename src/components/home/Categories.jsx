import { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Categories = () => {
  const [groupSize, setGroupSize] = useState(getInitialGroupSize())
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate() // Hook to programmatically navigate

  const fetchCategories = async () => {
    setLoading(true)
    axios
      .get(`https://banannylandapp.onrender.com/categories`, {
        params: {
          limit: 5
        }
      })
      .then(response => {
        console.log('API Response:', response.data)
        setCategories(response.data.categories)
      })
      .catch(error => console.error('Error fetching products:', error))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCategories()

    const handleResize = () => {
      if (window.innerWidth >= 1024) setGroupSize(6)
      else if (window.innerWidth >= 768) setGroupSize(4)
      else if (window.innerWidth >= 576) setGroupSize(3)
      else setGroupSize(2)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function getInitialGroupSize () {
    if (window.innerWidth >= 1024) return 6
    if (window.innerWidth >= 768) return 4
    if (window.innerWidth >= 576) return 3
    return 2
  }

  const groupCards = (cards, groupSize) => {
    groupSize = groupSize - 1
    const grouped = []
    for (let i = 0; i < cards.length; i += groupSize) {
      grouped.push(cards.slice(i, i + groupSize))
    }
    return grouped
  }

  const groupedCards = groupCards(categories, groupSize)

  const handleCategoryClick = category => {
    navigate(`/search?category=${category}`) // Navigates to search with category as query parameter
  }

  if (loading) {
    return <p className='text-center'>Cargando productos...</p>
  }

  return (
    <div className='container text-center d-flex flex-column align-items-center justify-content-center my-4'>
      <h2 className='fw-bold mb-3'>Categorías</h2>
      <div className='rainbow-divider mb-3'></div>
      {/* Rainbow divider below the header */}
      <Carousel
        interval={null}
        indicators={false}
        className='w-100'
        prevIcon={
          <i className='bi bi-caret-left-fill text-primary h1 fw-bold'></i>
        }
        nextIcon={
          <i className='bi bi-caret-right-fill text-primary h1 fw-bold'></i>
        }
      >
        {groupedCards.map((group, idx) => (
          <Carousel.Item key={idx}>
            <div className='d-flex justify-content-center'>
              {group.map(item => (
                <div
                  key={item.name}
                  className={`p-3 p-lg-4 col-${12 / groupSize}`}
                  onClick={() => handleCategoryClick(item.name)} // Handles the category click
                >
                  <div
                    className='ratio ratio-1x1 rounded rounded-5'
                    style={{ overflow: 'hidden' }}
                  >
                    <a href={`/search?category=${item.name}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          objectFit: 'cover', // Ensures the image fills the container properly
                          width: '100%', // Ensures full width
                          height: '100%' // Ensures full height
                        }}
                      />
                    </a>
                  </div>
                  <p className='text-center mt-2'>{item.name}</p>
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
