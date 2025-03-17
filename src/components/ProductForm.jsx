import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal, Button } from 'react-bootstrap';
import slugify from "slugify";

const schema = yup.object({
  name: yup.string().required('Nombre del producto es obligatorio'),
  slug: yup.string().required("El slug es obligatorio"),
  description: yup.string().required('Descripción requerida'),
  category: yup.string().required('Selecciona una categoría'),
  season: yup.string().required('Selecciona una temporada'),
}).required();

const ProductDescription = ({ productId }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const [categories, setCategories] = useState(['Ropa', 'Tazas']);
  const [seasons, setSeasons] = useState(['Día de Muertos', '14 de Febrero']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSeason, setNewSeason] = useState('');
  const [prices, setPrices] = useState([{ id: Date.now(), price: '', minQty: '', maxQty: '' }]);
  const [customizations, setCustomizations] = useState([{ id: Date.now(), name: '', type: '', description: '', options: '' }]);

  useEffect(() => {
    setValue("slug", slugify(watch("name") || "", { lower: true }));
  }, [watch("name"), setValue]);

  const addPriceRow = () => {
    setPrices([...prices, { id: Date.now(), price: '', minQty: '', maxQty: '' }]);
  };

  const addCustomizationRow = () => {
    setCustomizations([...customizations, { id: Date.now(), name: '', type: '', description: '', options: '' }]);
  };

  const addNewCategory = () => {
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setShowCategoryModal(false);
    }
  };

  const addNewSeason = () => {
    if (newSeason) {
      setSeasons([...seasons, newSeason]);
      setNewSeason('');
      setShowSeasonModal(false);
    }
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  // Function to handle type change and enable options field
  const handleTypeChange = (index, type) => {
    const newCustomizations = [...customizations];
    newCustomizations[index].type = type;
    // Enable/disable options input based on type
    if (type !== 'enum') {
      newCustomizations[index].options = ''; // Clear options if it's not 'enum'
    }
    setCustomizations(newCustomizations);
  };

  return (
    <div className='container my-4'>
      <form onSubmit={handleSubmit(onSubmit)} className='d-flex flex-column'>
        <label>Nombre del Producto</label>
        <input {...register('name')} className='form-control mb-2' />
        <p className='text-danger'>{errors.name?.message}</p>

        <div className="d-flex flex-column col-12">
          <label>Slug</label>
          <input {...register("slug")} readOnly className="my-2 p-2 border bg-light" />
        </div>

        <label>Descripción</label>
        <textarea {...register('description')} className='form-control mb-2' rows='3'></textarea>
        <p className='text-danger'>{errors.description?.message}</p>

        <div className='d-flex row'>
          <div className='col-6'>
            <label>Categoría</label>
            <div className='row px-2'>
            <select {...register('category')} className='col-8 form-control'>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={() => setShowCategoryModal(true)} className='col-4 btn btn-dark'>Agregar nueva categoría</button>
            </div>
          </div>

          <div className='col-6 px-2'>
            <label>Temporada</label>
            <div className='row px-2'>
            <select {...register('category')} className='col-8 form-control'>
              {seasons.map((season, index) => (
                <option key={index} value={season}>{season}</option>
              ))}
            </select>
            <button onClick={() => setShowSeasonModal(true)} className='col-4 btn btn-dark'>Agregar nueva temporada</button>
            </div>
          </div>
        </div>

        <h5 className='mt-4'>Precios</h5>
        <div className='row fw-bold'>
          <div className='col-4'>Precio</div>
          <div className='col-4'>Cantidad Mínima</div>
          <div className='col-4'>Cantidad Máxima</div>
        </div>
        {prices.map((price, index) => (
          <div key={price.id} className='row mb-2'>
            <input className='col-4 form-control' placeholder='$' />
            <input className='col-4 form-control' placeholder='Min' />
            <input className='col-4 form-control' placeholder='Max' />
          </div>
        ))}
        <button type='button' className='btn btn-primary' onClick={addPriceRow}>+</button>

        <h5 className='mt-4'>Personalización</h5>
        <div className='row fw-bold'>
          <div className='col-3'>Nombre</div>
          <div className='col-3'>Tipo</div>
          <div className='col-3'>Descripción</div>
          <div className='col-3'>Opciones</div>
        </div>
        {customizations.map((custom, index) => (
          <div key={custom.id} className='row mb-2 d-flex'>
            <input className='col-3 form-control' placeholder='Nombre' />
            <select 
              className='col-3 form-control' 
              value={custom.type} 
              onChange={(e) => handleTypeChange(index, e.target.value)}
            >
              <option value='text'>Texto</option>
              <option value='file'>Archivo</option>
              <option value='enum'>Lista</option>
            </select>
            <input className='col-3 form-control' placeholder='Descripción' />
            <input 
              className='col-3 form-control' 
              placeholder='Opciones' 
              value={custom.options} 
              onChange={(e) => {
                const newCustomizations = [...customizations];
                newCustomizations[index].options = e.target.value;
                setCustomizations(newCustomizations);
              }} 
              disabled={custom.type !== 'enum'}
            />
          </div>
        ))}
        <button type='button' className='btn btn-primary' onClick={addCustomizationRow}>+</button>

        <button type='submit' className='btn btn-success mt-3'>Guardar Producto</button>
      </form>

      {/* Modal for Adding Category */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type='text'
            className='form-control'
            placeholder='Nueva categoría'
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowCategoryModal(false)}>Cancelar</Button>
          <Button variant='primary' onClick={addNewCategory}>Agregar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding Season */}
      <Modal show={showSeasonModal} onHide={() => setShowSeasonModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Temporada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type='text'
            className='form-control'
            placeholder='Nueva temporada'
            value={newSeason}
            onChange={(e) => setNewSeason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowSeasonModal(false)}>Cancelar</Button>
          <Button variant='primary' onClick={addNewSeason}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDescription;
