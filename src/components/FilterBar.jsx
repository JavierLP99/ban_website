import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FilterBar({ products }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedTags, setSelectedTags] = useState('');
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      // Extract unique categories from the products data
      const uniqueCategories = [
        ...new Set(products.map(product => product.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  const applyFilters = () => {
    // Prepare the filters object
    const filters = {
      category: selectedCategory,
      minPrice: minPrice ? parseFloat(minPrice) : 0,
      maxPrice: maxPrice ? parseFloat(maxPrice) : Infinity,
      tags: selectedTags ? selectedTags.split(',').map(tag => tag.trim()) : [],
    };


    // Update the URL with the filter parameters
    updateUrl(filters);
  };

  const clearFilters = () => {
    // Reset the form fields
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedTags('');

    // Reset the filters
    const filters = {
      category: '',
      minPrice: 0,
      maxPrice: Infinity,
      tags: [],
    };
    // Update the URL to remove all filters
    updateUrl(filters);
  };

  const updateUrl = (filters) => {
    const urlParams = new URLSearchParams();

    // Add the filters to the URL params
    if (filters.category) urlParams.set('category', filters.category);
    if (filters.minPrice) urlParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) urlParams.set('maxPrice', filters.maxPrice);
    if (filters.tags.length > 0) urlParams.set('tags', filters.tags.join(','));

    // Navigate to the new URL with filters
    navigate(`?${urlParams.toString()}`, { replace: true });
  };

  return (
    <div className="d-flex gap-3 mb-3">
      {/* Category Selection */}
      <select
        className="form-select"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Price Range */}
      <input
        type="number"
        className="form-control"
        placeholder="Precio mínimo"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        className="form-control"
        placeholder="Precio máximo"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      {/* Tags Selection */}
      <input
        type="text"
        className="form-control"
        placeholder="Etiquetas (separadas por coma)"
        value={selectedTags}
        onChange={(e) => setSelectedTags(e.target.value)}
      />

      {/* Apply Filters Button */}
      <button className="btn btn-primary" onClick={applyFilters}>
        Aplicar Filtros
      </button>

      {/* Clear Filters Button */}
      <button className="btn btn-secondary" onClick={clearFilters}>
        Borrar Filtros
      </button>
    </div>
  );
}
