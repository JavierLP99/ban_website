import { useState } from 'react';

export default function FilterBar({ setFilters }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedTags, setSelectedTags] = useState('');

  const applyFilters = () => {
    setFilters({
      category: selectedCategory,
      minPrice: minPrice ? parseFloat(minPrice) : 0,
      maxPrice: maxPrice ? parseFloat(maxPrice) : Infinity,
      tags: selectedTags ? selectedTags.split(',').map(tag => tag.trim()) : [],
    });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedTags('');
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: Infinity,
      tags: [],
    });
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
        <option value="Cajas">Cajas</option>
        <option value="Tazas">Tazas</option>
        <option value="Camisas">Camisas</option>
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
