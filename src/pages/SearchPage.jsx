import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import FilterBar from '../components/FilterBar'
import ProductList from '../components/ProductList'

export default function SearchPage () {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.toLowerCase() || ''
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10
  const debounceTimeout = useRef(null)

  // Fetch all products on initial load
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(
          `https://banannylandapp.onrender.com/products`,
          {
            params: {
              limit: 1000,
              sortBy: 'updatedAt',
              order: 'desc'
            }
          }
        )
        setAllProducts(response.data.products)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Error al cargar los productos. Por favor intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, [])

  // Filter products based on search params
  const filterProducts = useCallback((products, params) => {
    const category = params.get('category')?.toLowerCase() || ''
    const season = params.get('season')?.toLowerCase() || ''
    const minPrice = params.get('minPrice')
      ? parseFloat(params.get('minPrice'))
      : 0
    const maxPrice = params.get('maxPrice')
      ? parseFloat(params.get('maxPrice'))
      : Infinity
    const tags = params.get('tags')
      ? params
          .get('tags')
          .split(',')
          .map(tag => tag.trim().toLowerCase())
      : []
    const searchQuery = params.get('q')?.toLowerCase() || ''

    return products.filter(product => {
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery)

      const matchesCategory =
        category === '' || product.category?.toLowerCase().includes(category)

      const matchesSeason =
        season === '' ||
        product.seasons?.some(s => s.toLowerCase().includes(season))

      const productPrice =
        product.referencePrice ||
        (product.price?.length > 0 ? product.price[0].price : 0)
      const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice

      const matchesTags =
        tags.length === 0 ||
        tags.some(tag => product.tags?.map(t => t.toLowerCase()).includes(tag))

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeason &&
        matchesPrice &&
        matchesTags
      )
    })
  }, [])

  // Apply filters when searchParams or allProducts change
  useEffect(() => {
    if (allProducts.length > 0) {
      clearTimeout(debounceTimeout.current)
      debounceTimeout.current = setTimeout(() => {
        const filtered = filterProducts(allProducts, searchParams)
        setFilteredProducts(filtered)
        setCurrentPage(1)
      }, 300)
    }

    return () => clearTimeout(debounceTimeout.current)
  }, [searchParams, allProducts, filterProducts])

  // Calculate pagination values
  const { paginatedProducts, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const paginated = filteredProducts.slice(startIndex, endIndex)
    const total = Math.ceil(filteredProducts.length / productsPerPage)
    return { paginatedProducts: paginated, totalPages: total }
  }, [filteredProducts, currentPage])

  // Extract filter options from filtered products
  const filterOptions = useMemo(() => {
    const categories = new Set()
    const seasons = new Set()
    const tags = new Set()
    let minPrice = Infinity
    let maxPrice = 0

    filteredProducts.forEach(product => {
      if (product.category) categories.add(product.category)
      if (product.seasons)
        product.seasons.forEach(season => seasons.add(season))
      if (product.tags) product.tags.forEach(tag => tags.add(tag))

      const price =
        product.referencePrice ||
        (product.price?.length > 0 ? product.price[0].price : 0)
      minPrice = Math.min(minPrice, price)
      maxPrice = Math.max(maxPrice, price)
    })

    return {
      categories: Array.from(categories).sort(),
      seasons: Array.from(seasons).sort(),
      tags: Array.from(tags).sort(),
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice === 0 ? 1000 : maxPrice
      }
    }
  }, [filteredProducts])

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  return (
    <div className='container mt-4'>
      <FilterBar products={filteredProducts} filterOptions={filterOptions} />

      {loading ? (
        <div className='d-flex justify-content-center my-5'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      ) : error ? (
        <p className='text-center text-danger'>{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className='text-center'>
          No se encontraron productos que coincidan con tu búsqueda.
        </p>
      ) : (
        <>
          <ProductList products={paginatedProducts} />

          {totalPages > 1 && (
            <div className='pagination justify-content-center gap-4 mt-4'>
              <button
                className='btn btn-secondary'
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages} ({filteredProducts.length}{' '}
                productos)
              </span>
              <button
                className='btn btn-secondary'
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
