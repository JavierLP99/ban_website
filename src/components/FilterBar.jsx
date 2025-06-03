import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function FilterBar ({ products, filterOptions }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState(null)

  // Initialize state from URL params
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    season: searchParams.get('season') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    tags: searchParams.get('tags') || '',
    q: searchParams.get('q') || ''
  })

  // Toggle accordion section
  const toggleAccordion = section => {
    setActiveAccordion(activeAccordion === section ? null : section)
  }

  // Debounce function
  const useDebounce = (callback, delay) => {
    const timeoutRef = useRef()
    return useCallback(
      (...args) => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => callback(...args), delay)
      },
      [callback, delay]
    )
  }

  // Extract all unique tags from products
  const allTags = useMemo(() => {
    const tags = new Set()
    products.forEach(product => {
      if (product.tags) product.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [products])

  // Update URL when filters change (with debounce)
  const debouncedUpdateUrl = useDebounce(newFilters => {
    if (!window.location.pathname.includes('/producto/')) {
      navigate(`?${params.toString()}`, { replace: true })
    }
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') params.set(key, value)
    })
    navigate(`?${params.toString()}`, { replace: true })
  }, 300)

  // Update URL when filters change
  // useEffect(() => {
  //   debouncedUpdateUrl(filters)
  //   return () => clearTimeout(debouncedUpdateUrl.timeoutRef)
  // }, [filters, debouncedUpdateUrl])

  // Add this function to apply filters on button click
  const applyFilters = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') params.set(key, value)
    })
    navigate(`?${params.toString()}`, { replace: true })
  }

  // Initialize form from URL on mount
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      season: searchParams.get('season') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      tags: searchParams.get('tags') || '',
      q: searchParams.get('q') || ''
    })
  }, [searchParams])

  const handleFilterChange = e => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      season: '',
      minPrice: '',
      maxPrice: '',
      tags: '',
      q: ''
    })
    setIsMobileFiltersOpen(false)
  }

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className='d-md-none mb-3'>
        <button
          className='btn btn-primary w-100 d-flex align-items-center justify-content-between'
          data-bs-toggle='offcanvas'
          data-bs-target='#offcanvasFilters'
          aria-controls='offcanvasFilters'
        >
          <span>Filtros</span>
          <i className='bi bi-funnel-fill'></i>
        </button>
      </div>

      {/* Filter Panel */}
      <div className='card mb-4 d-none d-md-block'>
        <div className='card-body'>
          {/* Desktop: Horizontal Layout */}
          <div className='d-none d-md-block'>
            <div className='row g-3'>
              <div className='col-md-3'>
                <select
                  className='form-select'
                  name='category'
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value=''>Todas las categorías</option>
                  {filterOptions?.categories?.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className='col-md-2'>
                <select
                  className='form-select'
                  name='season'
                  value={filters.season}
                  onChange={handleFilterChange}
                >
                  <option value=''>Todas las temporadas</option>
                  {filterOptions?.seasons?.map(season => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>

              <div className='col-md-3'>
                <div className='input-group'>
                  <span className='input-group-text'>Precio</span>
                  <input
                    type='number'
                    className='form-control'
                    placeholder='Mín'
                    name='minPrice'
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    min={0}
                    max={filterOptions?.priceRange?.max}
                  />
                  <input
                    type='number'
                    className='form-control'
                    placeholder='Máx'
                    name='maxPrice'
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    min={0}
                    max={filterOptions?.priceRange?.max}
                  />
                </div>
              </div>

              <div className='col-md-2'>
                <select
                  className='form-select'
                  name='tags'
                  value={filters.tags}
                  onChange={handleFilterChange}
                >
                  <option value=''>Todas las etiquetas</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-md-2 d-flex justify-content-end'>
                <button className='btn btn-primary me-2' onClick={applyFilters}>
                  Aplicar
                </button>
                <button
                  className='btn btn-outline-secondary'
                  onClick={clearFilters}
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile: Accordion Layout */}
      <div className='d-block d-md-none'>
        <div
          className='offcanvas offcanvas-start'
          tabIndex='-1'
          id='offcanvasFilters'
          aria-labelledby='offcanvasFiltersLabel'
        >
          <div className='offcanvas-header'>
            <h5 className='offcanvas-title' id='offcanvasFiltersLabel'>
              Filtros
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='offcanvas'
              aria-label='Cerrar'
            ></button>
          </div>

          {/* Category Filter */}
          <select
            className='form-select my-2'
            name='category'
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value=''>Todas las categorías</option>
            {filterOptions?.categories?.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className='form-select my-2'
            name='season'
            value={filters.season}
            onChange={handleFilterChange}
          >
            <option value=''>Todas las temporadas</option>
            {filterOptions?.seasons?.map(season => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>

          <div className='row g-2 my-2'>
            <div className='col-6'>
              <div className='input-group'>
                <span className='input-group-text'>Mín</span>
                <input
                  type='number'
                  className='form-control'
                  name='minPrice'
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min={0}
                  max={filterOptions?.priceRange?.max}
                />
              </div>
            </div>
            <div className='col-6'>
              <div className='input-group'>
                <span className='input-group-text'>Máx</span>
                <input
                  type='number'
                  className='form-control'
                  name='maxPrice'
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min={0}
                  max={filterOptions?.priceRange?.max}
                />
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          <select
            className='form-select my-2'
            name='tags'
            value={filters.tags}
            onChange={handleFilterChange}
          >
            <option value=''>Todas las etiquetas</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
                  <div className='d-grid gap-2 mt-3'>
          <button className='btn btn-primary' onClick={applyFilters}>
            Aplicar filtros
          </button>
        </div>
        {/* Clear Filters Button (Mobile) */}
        <div className='d-grid gap-2 mt-3'>
          <button className='btn btn-outline-danger' onClick={clearFilters}>
            Limpiar todos los filtros
          </button>
        </div>
        </div>
      </div>
    </>
  )
}
