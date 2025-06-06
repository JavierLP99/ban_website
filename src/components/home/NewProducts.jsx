import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './NewProducts.css' // Assuming external CSS file for styling
import ProductList from '../ProductList'

const NewProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(
        'https://banannylandapp.onrender.com/products?page=1&limit=3&sortBy=updatedAt&order=asc'
      )
      // TODO: change bacj to order descending
      .then(response => {
        setProducts(response.data.products)
      })
      .catch(error => console.error('Error fetching products:', error))
      .finally(() => setLoading(false))
  }, [])

  const Card = ({ image, name, url, description }) => {
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const cardRef = useRef(null)

    const handleMouseMove = e => {
      const width = cardRef.current.offsetWidth
      const height = cardRef.current.offsetHeight
      const x = e.pageX - cardRef.current.offsetLeft - width / 2
      const y = e.pageY - cardRef.current.offsetTop - height / 2
      setMouseX(x)
      setMouseY(y)
    }

    const handleMouseLeave = () => {
      setMouseX(0)
      setMouseY(0)
    }

    const mousePX = mouseX / cardRef.current?.offsetWidth
    const mousePY = mouseY / cardRef.current?.offsetHeight

    const cardStyle = {
      transform: `rotateY(${mousePX * 45}deg) rotateX(${mousePY * -45}deg)`
    }

    const cardBgTransform = {
      transform: `translateX(${mousePX * -60}px) translateY(${
        mousePY * -60
      }px) scale(1.1)`
    }

    const cardBgImage = {
      backgroundImage: `url(${image})`
    }

    return (
      <a
        href={`/producto/${url}`}
        className='card-wrap'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={cardRef}
      >
        <div className='card' style={cardStyle}>
          <div
            className='card-bg'
            style={{ ...cardBgTransform, ...cardBgImage }}
          ></div>
          <div className='card-info'>
            <h1>{name}</h1>
            <p>{description}</p>
          </div>
        </div>
      </a>
    )
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

  return (
    <section className='py-5 new-products-section'>
      <div className='container text-center d-flex flex-column align-items-center justify-content-center'>
        <h2 className='fw-bold mb-3'>Nuevos productos</h2>
        <div className='rainbow-divider mb-3'></div>{' '}
        {/* Rainbow divider below the header */}
        <p className='text-muted mb-5'>
          Descubre nuestros últimos productos diseñados con pasión y calidad.
        </p>
        <div className='row justify-content-center w-100'>
          {products.map(product => (
            <div
              key={product['_id']}
              className='col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-4'
            >
              <Card
                image={product.images[0]}
                name={product.name}
                url={product.slug}
                description={product.description}
              />
            </div>
          ))}
        </div>


        <a href='/search' className='btn btn-dark rounded-5'>
          Ver todos los productos
        </a>
      </div>

    </section>
  )
}

export default NewProducts
