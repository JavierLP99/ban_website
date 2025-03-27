import { useEffect, useState } from 'react'; 
import { useSearchParams } from 'react-router-dom'; 
import axios from 'axios';
import FilterBar from '../components/FilterBar'; 
import ProductList from '../components/ProductList';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultFilters = {
    category: '',
    minPrice: 0,
    maxPrice: Infinity,
    tags: [],
  };
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    // Get filters from URL parameters
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : 0;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : Infinity;
    const tags = searchParams.get('tags') ? searchParams.get('tags').split(',').map(tag => tag.trim()) : [];

    console.log('Filters from URL:', { category, minPrice, maxPrice, tags });

    // Update filters state based on URL parameters
    setFilters({ category, minPrice, maxPrice, tags });
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    console.log('Fetching products with:', {
      page: 1,
      limit: 10,
      sortBy: 'updatedAt',
      order: 'desc',
      search: query,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      tags: filters.tags.length > 0 ? filters.tags.join(',') : undefined,
    });

    axios
      .get(`https://banannylandapp.onrender.com/products`, {
        params: {
          page: 1,
          limit: 10,
          sortBy: 'updatedAt',
          order: 'desc',
          search: query,
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          tags: filters.tags.length > 0 ? filters.tags.join(',') : undefined,
        },
      })
      .then(response => {
        console.log('API Response:', response.data);
        setProducts(response.data.products);
      })
      .catch(error => console.error('Error fetching products:', error))
      .finally(() => setLoading(false));
  }, [query, filters]);

  return (
    <div className="container mt-4">
      <FilterBar setFilters={setFilters} products={products} />
      {loading ? (
        <p>Cargando productos...</p>
      ) : products.length === 0 ? (
        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}
