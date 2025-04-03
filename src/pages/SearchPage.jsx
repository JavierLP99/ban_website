import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FilterBar from '../components/FilterBar';
import ProductList from '../components/ProductList';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0); // State to hold total pages
  const [currentPage, setCurrentPage] = useState(1); // State to hold current page



  useEffect(() => {
    setLoading(true);


    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : 0;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : Infinity;
    const tags = searchParams.get('tags') ? searchParams.get('tags').split(',').map(tag => tag.trim()) : [];

    console.log('Filters from URL:', { category, minPrice, maxPrice, tags });


    console.log('Fetching products with:', {
      page: currentPage,
      limit: 10,
      sortBy: 'updatedAt',
      order: 'desc',
      search: query,
      category: category,
      minPrice: minPrice,
      maxPrice: maxPrice,
      tags: tags.length > 0 ? tags.join(',') : undefined,
    });

    axios
      .get(`https://banannylandapp.onrender.com/products`, {
        params: {
          page: currentPage,
          limit: 5,
          sortBy: 'updatedAt',
          order: 'desc',
          search: query,
          category: category,
          minPrice: minPrice,
          maxPrice: maxPrice,
          tags: tags.length > 0 ? tags.join(',') : undefined,
        },
      })
      .then(response => {
        console.log('API Response:', response.data);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages); // Set total pages from API response
      })
      .catch(error => console.error('Error fetching products:', error))
      .finally(() => setLoading(false));
  }, [query,  currentPage, searchParams]); // Added currentPage as dependency

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };

  return (
    <div className="container mt-4">
      <FilterBar products={products} />
      {loading ? (
        <p className='text-center'>Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className='text-center'>No se encontraron productos que coincidan con tu búsqueda.</p>
      ) : (
        <>
          <ProductList products={products} />
          <div className="pagination justify-content-center gap-4">
            <button
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </button>
            <span>{currentPage} de {totalPages}</span>
            <button
              className="btn btn-secondary"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
