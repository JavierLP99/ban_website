import { useEffect, useState } from 'react'; 
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import ProductList from '../components/ProductList';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const defaultFilters = {
    category: '',
    minPrice: 0,
    maxPrice: Infinity,
    tags: [],
  };
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    fetch('/products.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
      })
      .catch(error => console.error('Error loading content:', error));
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    // Apply search query filtering
    let filtered = products.filter(product => 
      !query || 
      product.name.toLowerCase().includes(query) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
    );

    // Apply filters only when they differ from defaults
    if (JSON.stringify(filters) !== JSON.stringify(defaultFilters)) {
      filtered = filtered.filter(product => {
        const matchesCategory = 
          !filters.category || product.category.toLowerCase() === filters.category.toLowerCase();

          const productPrice = Math.max(...Object.values(product.price));

          const matchesPrice =
            productPrice >= filters.minPrice && productPrice <= filters.maxPrice;
          

        const matchesTags =
          filters.tags.length === 0 ||
          filters.tags.some(tag => product.tags?.includes(tag));

        return matchesCategory && matchesPrice && matchesTags;
      });
    }

    setFilteredProducts(filtered);
  }, [query, filters, products]);

  return (
    <div className="container mt-4">
      <FilterBar setFilters={setFilters} />

      {filteredProducts.length === 0 ? (
        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </div>
  );
}
