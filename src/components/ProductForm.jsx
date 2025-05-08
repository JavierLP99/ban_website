/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Modal, Button } from 'react-bootstrap'
import slugify from 'slugify'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getThumbnailUrl, handleImageError } from '../utils/tools.jsx'
import ImageUploader from './ImageUploader'
import ProductCard from './ProductCard'

const schema = yup
  .object({
    name: yup.string().required('Nombre del producto es obligatorio'),
    slug: yup.string().required('El slug es obligatorio'),
    description: yup.string().required('Descripción requerida'),
    tags: yup.array().of(yup.string()),
    category: yup.string().required('Selecciona una categoría'),
    status: yup.string().required('Selecciona un estatus'),
    season: yup.string().required('Selecciona una temporada'),
    prices: yup.array().of(
      yup.object({
        price: yup
          .number()
          .required('Precio es obligatorio')
          .positive('El precio debe ser positivo')
          .typeError('El precio debe ser un número'),
        minQty: yup
          .number()
          .required('Cantidad mínima es obligatoria')
          .min(0, 'La cantidad mínima debe ser 0 o mayor')
          .typeError('La cantidad mínima debe ser un número'),
        maxQty: yup
          .number()
          .required('Cantidad máxima es obligatoria')
          .min(
            yup.ref('minQty'),
            'La cantidad máxima debe ser mayor o igual a la mínima'
          )
          .typeError('La cantidad máxima debe ser un número')
      })
    ),
    customizations: yup
      .array()
      .of(
        yup.object({
          name: yup
            .string()
            .required('Nombre de personalización es obligatorio'),
          type: yup
            .string()
            .required('Tipo de personalización es obligatorio')
            .oneOf(
              ['text', 'file', 'enum'],
              'Tipo debe ser uno de los siguientes: texto, archivo, lista'
            ),
          description: yup
            .string()
            .required('Descripción de personalización es obligatoria'),
          options: yup
            .string()
            .nullable()
            .when('type', {
              is: 'enum',
              then: schema =>
                schema.required(
                  'Las opciones son obligatorias para tipo lista'
                ),
              otherwise: schema => schema.notRequired().nullable()
            })
        })
      )
      .default([])
  })
  .required()

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      tags: []
    },
    resolver: yupResolver(schema)
  })

  // State declarations
  const [categories, setCategories] = useState([])
  const [seasons, setSeasons] = useState([])
  const [prices, setPrices] = useState([
    { id: Date.now(), price: '', minQty: '', maxQty: '' }
  ])
  const [customizations, setCustomizations] = useState([
    { id: Date.now(), name: '', type: '', description: '', options: '' }
  ])
  const [selectedImages, setSelectedImages] = useState([])
  const [customizationImageMap, setCustomizationImageMap] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [operationState, setOperationState] = useState({
    isProcessing: false,
    needsProvisioning: !id
  })
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [procedure, setProcedure] = useState(id ? 'Edit' : 'Create')
  const [galleryName, setGalleryName] = useState('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSeasonModal, setShowSeasonModal] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newSeason, setNewSeason] = useState('')

  const statusList = ['Disponible', 'Agotado', 'Descontinuado', 'Borrador']

  // Memoized fetch function
  const fetchCategories = useCallback(async () => {
    try {
      const [categoriesRes, seasonsRes] = await Promise.all([
        axios.get('https://banannylandapp.onrender.com/categories'),
        axios.get('https://banannylandapp.onrender.com/seasons')
      ])
      setCategories(categoriesRes.data.categories.map(c => c.name))
      setSeasons(seasonsRes.data.seasons.map(s => s.name))
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  }, [])

  // Main data loading effect
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const loadData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const cloneId = urlParams.get('id')

        await fetchCategories()

        if (id) {
          setProcedure('Edit')
          const response = await axios.get(
            `https://banannylandapp.onrender.com/products/${id}`,
            { signal }
          )
          const product = response.data.product
          initializeForm(product)
          setGalleryName(product._id)
        } else if (cloneId) {
          setProcedure('Clone')
          const [original, provisioned] = await Promise.all([
            axios.get(
              `https://banannylandapp.onrender.com/products/${cloneId}`,
              { signal }
            ),
            axios.post(
              `https://banannylandapp.onrender.com/products/provision`,
              null,
              { signal }
            )
          ])
          initializeForm(original.data.product, true)
          setGalleryName(provisioned.data._id)
        } else if (operationState.needsProvisioning) {
          setProcedure('Create')
          const response = await axios.post(
            `https://banannylandapp.onrender.com/products/provision`,
            null,
            { signal }
          )
          setGalleryName(response.data._id)
          setOperationState(prev => ({ ...prev, needsProvisioning: false }))
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error loading product data:', error)
          setMessage('Error al cargar los datos del producto')
          setMessageType('error')
        }
      } finally {
        setLoading(false)
      }
    }

    const initializeForm = (product, isClone = false) => {
      setValue('name', isClone ? `${product.name} (1)` : product.name)
      setValue('slug', isClone ? `${product.slug}-1` : product.slug)
      setValue('description', product.description)
      setTags(product.tags || [])
      setValue('category', product.category)
      setValue('status', product.status)
      setValue('season', product.seasons?.[0] || '')
      setSelectedImages([])

      const formattedPrices = product.price.map((p, index) => ({
        id: index,
        price: p.price,
        minQty: parseInt(p.quantity.split('-')[0], 10),
        maxQty: parseInt(p.quantity.split('-')[1], 10)
      }))
      setPrices(formattedPrices)
      setValue('prices', formattedPrices)

      const formattedCustomizations = product.customizationOptions.map(
        (custom, index) => ({
          id: index,
          name: custom.name,
          type: custom.type,
          description: custom.description,
          options: Array.isArray(custom.options)
            ? custom.options.join(', ')
            : custom.options || ''
        })
      )
      setCustomizations(formattedCustomizations)
      setValue('customizations', formattedCustomizations)

      // if (!isClone && Array.isArray(product.customizationImageMap)) {
      //   setCustomizationImageMap(
      //     product.customizationImageMap.map(entry => ({
      //       combination: entry.combination || {},
      //       imageUrls: entry.imageUrls || []
      //     }))
      //   )
      // }
    }

    loadData()

    return () => controller.abort()
  }, [id, setValue, fetchCategories, operationState.needsProvisioning])

  // Slug generation with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue('slug', slugify(watch('name') || '', { lower: true }))
    }, 300)
    return () => clearTimeout(timeout)
  }, [watch('name'), setValue])

  // Form handlers
  const handleImageSelect = images => {
    setValue('images', images)
    setSelectedImages(images)
    setShowModal(false)
  }

  const addPriceRow = () => {
    const newPrices = [
      ...prices,
      { id: Date.now(), price: '', minQty: '', maxQty: '' }
    ]
    setPrices(newPrices)
    setValue('prices', newPrices)
  }

  const addCustomizationRow = () => {
    const newCustomizations = [
      ...customizations,
      { id: Date.now(), name: '', type: '', description: '', options: '' }
    ]
    setCustomizations(newCustomizations)
    setValue('customizations', newCustomizations)
  }

  const removePriceRow = index => {
    const newPrices = prices.filter((_, i) => i !== index)
    setPrices(newPrices)
    setValue('prices', newPrices)
  }

  const removeCustomizationRow = index => {
    const newCustomizations = customizations.filter((_, i) => i !== index)
    setCustomizations(newCustomizations)
    setValue('customizations', newCustomizations)
  }

  const handleTypeChange = (index, type) => {
    const newCustomizations = [...customizations]
    newCustomizations[index].type = type
    if (type !== 'enum') {
      newCustomizations[index].options = ''
    }
    setCustomizations(newCustomizations)
    setValue(`customizations.${index}.type`, type)
    setValue(
      `customizations.${index}.options`,
      newCustomizations[index].options
    )
  }

  const handleTagInput = e => {
    const key = e.key
    if ((key === 'Enter' || key === ',') && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()]
        setTags(newTags)
        setValue('tags', newTags)
      }
      setTagInput('')
    }
  }

  const removeTag = tagToRemove => {
    const newTags = tags.filter(t => t !== tagToRemove)
    setTags(newTags)
    setValue('tags', newTags)
  }

  const addNewCategory = () => {
    if (newCategory) {
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      setValue('category', newCategory)
      setNewCategory('')
      setShowCategoryModal(false)
    }
  }

  const addNewSeason = () => {
    if (newSeason) {
      const updatedSeasons = [...seasons, newSeason]
      setSeasons(updatedSeasons)
      setValue('season', newSeason)
      setNewSeason('')
      setShowSeasonModal(false)
    }
  }

  // Form submission
  const onSubmit = async data => {
    setOperationState(prev => ({ ...prev, isProcessing: true }))
    setMessage('Cargando...')
    setMessageType('info')

    try {
      const formattedPrices = prices.map(price => ({
        quantity: `${price.minQty}-${price.maxQty}`,
        customizations: [],
        price: Number(price.price)
      }))

      const formattedCustomizations = customizations.map(custom => ({
        name: custom.name,
        type: custom.type,
        description: custom.description,
        options: custom.options ? custom.options.split(',') : []
      }))

      const payload = {
        ...data,
        price: formattedPrices,
        customizationOptions: formattedCustomizations,
        seasons: [data.season],
        images: selectedImages,
        customizationImageMap: customizationImageMap,
        tags: tags
      }

      delete payload.season
      delete payload.customizations
      delete payload.prices

      const response = await axios.put(
        `https://banannylandapp.onrender.com/products/${galleryName}`,
        payload
      )

      setMessage(
        procedure === 'Edit'
          ? 'Producto actualizado exitosamente.'
          : procedure === 'Create'
          ? 'Producto creado exitosamente.'
          : 'Producto clonado exitosamente.'
      )
      setMessageType('success')

      // Redirect after successful save
      setTimeout(() => navigate('/listadeproductos'), 3000)
    } catch (error) {
      setMessage('Hubo un error al guardar el producto. Inténtalo de nuevo.')
      setMessageType('error')
      console.error('Error saving product:', error)
    } finally {
      setOperationState(prev => ({ ...prev, isProcessing: false }))
    }
  }

  if (loading) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Cargando...</span>
          </div>
          <p className='mt-2 text-muted'>Cargando producto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container my-4'>
      <h1>
        {procedure === 'Edit' && 'Editar producto'}
        {procedure === 'Create' && 'Crear producto'}
        {procedure === 'Clone' && 'Clonar producto'}
      </h1>

      <div className='row'>
        <div className='col-12 col-lg-8'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='d-flex flex-column gap-3'
          >
            {/* Name Field */}
            <div>
              <label className='form-label'>Nombre del Producto</label>
              <input {...register('name')} className='form-control' />
              <p className='text-danger'>{errors.name?.message}</p>
            </div>

            {/* Slug Field */}
            <div>
              <label className='form-label'>Slug</label>
              <input
                {...register('slug')}
                readOnly
                className='form-control bg-light'
              />
            </div>

            {/* Description Field */}
            <div>
              <label className='form-label'>Descripción</label>
              <textarea
                {...register('description')}
                className='form-control'
                rows='3'
              />
              <p className='text-danger'>{errors.description?.message}</p>
            </div>

            {/* Tags Field */}
            <div>
              <label className='form-label'>Etiquetas</label>
              <div className='form-control d-flex flex-wrap gap-2 p-2'>
                {tags.map(tag => (
                  <span
                    className='badge bg-primary d-flex align-items-center'
                    key={tag}
                  >
                    {tag}
                    <button
                      type='button'
                      className='btn-close btn-close-white ms-2'
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                    />
                  </span>
                ))}
                <input
                  className='border-0 flex-grow-1'
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder='Agrega una etiqueta y presiona Enter'
                />
              </div>
              <p className='text-danger'>{errors.tags?.message}</p>
            </div>

            {/* Category and Season */}
            <div className='row g-3'>
              <div className='col-md-6'>
                <label className='form-label'>Categoría</label>
                <div className='input-group'>
                  <select {...register('category')} className='form-select'>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type='button'
                    onClick={() => setShowCategoryModal(true)}
                    className='btn btn-outline-primary'
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='col-md-6'>
                <label className='form-label'>Temporada</label>
                <div className='input-group'>
                  <select {...register('season')} className='form-select'>
                    {seasons.map((season, index) => (
                      <option key={index} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                  <button
                    type='button'
                    onClick={() => setShowSeasonModal(true)}
                    className='btn btn-outline-primary'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Prices Section */}
            <div className='mt-4'>
              <h5>Precios</h5>
              <div className='table-responsive'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Precio</th>
                      <th>Mínimo</th>
                      <th>Máximo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((price, index) => (
                      <tr key={price.id}>
                        <td>
                          <div className='position-relative'>
                            <input
                              className={`form-control ${
                                errors.prices?.[index]?.price
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              {...register(`prices.${index}.price`)}
                              value={price.price}
                              onChange={e => {
                                clearErrors(`prices.${index}.price`)
                                const newPrices = [...prices]
                                newPrices[index].price = e.target.value
                                setPrices(newPrices)
                              }}
                            />
                            {errors.prices?.[index]?.price && (
                              <div className='invalid-tooltip'>
                                {errors.prices[index].price.message}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className='position-relative'>
                            <input
                              className={`form-control ${
                                errors.prices?.[index]?.minQty
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              {...register(`prices.${index}.minQty`)}
                              value={price.minQty}
                              onChange={e => {
                                clearErrors(`prices.${index}.minQty`)
                                const newPrices = [...prices]
                                newPrices[index].minQty = e.target.value
                                setPrices(newPrices)
                              }}
                            />
                            {errors.prices?.[index]?.minQty && (
                              <div className='invalid-tooltip'>
                                {errors.prices[index].minQty.message}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className='position-relative'>
                            <input
                              className={`form-control ${
                                errors.prices?.[index]?.maxQty
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              {...register(`prices.${index}.maxQty`)}
                              value={price.maxQty}
                              onChange={e => {
                                clearErrors(`prices.${index}.maxQty`)
                                const newPrices = [...prices]
                                newPrices[index].maxQty = e.target.value
                                setPrices(newPrices)
                              }}
                            />
                            {errors.prices?.[index]?.maxQty && (
                              <div className='invalid-tooltip'>
                                {errors.prices[index].maxQty.message}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            type='button'
                            className='btn btn-danger'
                            onClick={() => removePriceRow(index)}
                            disabled={prices.length <= 1}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type='button'
                className='btn btn-primary mt-2'
                onClick={addPriceRow}
              >
                Agregar precio
              </button>
            </div>

            {/* Customizations Section */}
            <div className='mt-4'>
              <h5>Personalización</h5>
              <div className='table-responsive'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Opciones</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customizations.map((custom, index) => (
                      <tr key={custom.id}>
                        <td>
                          <div className='position-relative'>
                            <input
                              className={`form-control ${
                                errors.customizations?.[index]?.name
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              {...register(`customizations.${index}.name`)}
                              value={custom.name}
                              onChange={e => {
                                clearErrors(`customizations.${index}.name`)
                                const newCustoms = [...customizations]
                                newCustoms[index].name = e.target.value
                                setCustomizations(newCustoms)
                              }}
                            />
                            {errors.customizations?.[index]?.name && (
                              <div className='invalid-tooltip'>
                                {errors.customizations[index].name.message}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className='position-relative'>
                            <select
                              className={`form-select ${
                                errors.customizations?.[index]?.type
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              {...register(`customizations.${index}.type`)}
                              value={custom.type}
                              onChange={e =>
                                handleTypeChange(index, e.target.value)
                              }
                            >
                              <option value=''></option>
                              <option value='text'>Texto</option>
                              <option value='file'>Archivo</option>
                              <option value='enum'>Lista</option>
                            </select>
                            {errors.customizations?.[index]?.type && (
                              <div className='invalid-tooltip'>
                                {errors.customizations[index].type.message}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className='position-relative'>
                            <input
                              className={`form-control ${
                                errors.customizations?.[index]?.description
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              {...register(
                                `customizations.${index}.description`
                              )}
                              value={custom.description}
                              onChange={e => {
                                clearErrors(
                                  `customizations.${index}.description`
                                )
                                const newCustoms = [...customizations]
                                newCustoms[index].description = e.target.value
                                setCustomizations(newCustoms)
                              }}
                            />
                            {errors.customizations?.[index]?.description && (
                              <div className='invalid-tooltip'>
                                {
                                  errors.customizations[index].description
                                    .message
                                }
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className='position-relative'>
                            <input
                              className={`form-control ${
                                errors.customizations?.[index]?.options
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              {...register(`customizations.${index}.options`)}
                              value={custom.options}
                              onChange={e => {
                                clearErrors(`customizations.${index}.options`)
                                const newCustoms = [...customizations]
                                newCustoms[index].options = e.target.value
                                setCustomizations(newCustoms)
                              }}
                              disabled={custom.type !== 'enum'}
                            />
                            {errors.customizations?.[index]?.options && (
                              <div className='invalid-tooltip'>
                                {errors.customizations[index].options.message}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            type='button'
                            className='btn btn-danger'
                            onClick={() => removeCustomizationRow(index)}
                            disabled={customizations.length <= 1}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type='button'
                className='btn btn-primary mt-2'
                onClick={addCustomizationRow}
              >
                Agregar personalización
              </button>
            </div>

            {/* Images Section */}
            <div className='mt-4'>
              <h5>Imágenes</h5>
              <button
                type='button'
                className='btn btn-primary mb-3'
                onClick={() => setShowModal(true)}
              >
                Seleccionar imágenes
              </button>

              <div className='row row-cols-2 row-cols-md-3 g-3'>
                {selectedImages.map((url, index) => (
                  <div key={index} className='col'>
                    <div className='card h-100'>
                      <img
                        src={getThumbnailUrl(url)}
                        className='card-img-top img-fluid'
                        style={{ height: '150px', objectFit: 'cover' }}
                        onError={handleImageError}
                        alt={`Preview ${index + 1}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customization Image Mapping */}
            {customizationImageMap.length > 0 && (
              <div className='mt-4'>
                <h5>Asignar imágenes a combinaciones</h5>
                {customizationImageMap.map((mapEntry, mapIndex) => (
                  <div key={mapIndex} className='card mb-3'>
                    <div className='card-body'>
                      <h6 className='card-title'>
                        Combinación #{mapIndex + 1}
                      </h6>

                      {customizations
                        .filter(custom => custom.type === 'enum')
                        .map(custom => (
                          <div key={custom.name} className='mb-3'>
                            <label className='form-label'>{custom.name}</label>
                            <select
                              className='form-select'
                              value={mapEntry.combination?.[custom.name] || ''}
                              onChange={e => {
                                const updatedMap = [...customizationImageMap]
                                updatedMap[mapIndex].combination = {
                                  ...updatedMap[mapIndex].combination,
                                  [custom.name]: e.target.value
                                }
                                setCustomizationImageMap(updatedMap)
                              }}
                            >
                              <option value=''>Selecciona una opción</option>
                              {custom.options?.split(',').map(opt => (
                                <option key={opt.trim()} value={opt.trim()}>
                                  {opt.trim()}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}

                      <div className='d-flex flex-wrap gap-2'>
                        {selectedImages.map((url, i) => {
                          const isSelected = mapEntry.imageUrls?.includes(url)
                          return (
                            <div
                              key={i}
                              onClick={() => {
                                const updatedMap = [...customizationImageMap]
                                const currentImages =
                                  updatedMap[mapIndex].imageUrls || []
                                updatedMap[mapIndex].imageUrls = isSelected
                                  ? currentImages.filter(img => img !== url)
                                  : [...currentImages, url]
                                setCustomizationImageMap(updatedMap)
                              }}
                              style={{
                                cursor: 'pointer',
                                width: '80px',
                                height: '80px'
                              }}
                            >
                              <img
                                src={getThumbnailUrl(url)}
                                alt={`Option ${i + 1}`}
                                className={`img-thumbnail h-100 w-100 ${
                                  isSelected ? 'border-primary border-3' : ''
                                }`}
                                onError={handleImageError}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Combination Button */}
            <button
              type='button'
              className='btn btn-outline-primary'
              onClick={() => {
                setCustomizationImageMap(prev => [
                  ...prev,
                  { combination: {}, imageUrls: [] }
                ])
              }}
            >
              Agregar nueva combinación
            </button>

            {/* Status Field */}
            <div className='mt-4'>
              <h5>Estatus</h5>
              <select {...register('status')} className='form-select'>
                {statusList.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`alert alert-${messageType}`}>{message}</div>
            )}

            {/* Form Actions */}
            <div className='d-flex gap-3 mt-4'>
              <button
                type='submit'
                className='btn btn-success flex-grow-1'
                disabled={operationState.isProcessing}
              >
                {operationState.isProcessing ? (
                  <>
                    <span
                      className='spinner-border spinner-border-sm me-2'
                      role='status'
                      aria-hidden='true'
                    ></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar Producto'
                )}
              </button>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => navigate('/listadeproductos')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div className='col-4'>
        <ProductCard
          className='col-12'
          product={{
            name: watch('name'),
            category: watch('category'),
            slug: watch('slug'),
            referencePrice: watch('prices')?.[0]?.price ?? 0,
            images: selectedImages,
            tags: [watch('season')]
          }}
        />
      </div>

      </div>

      {/* Modals */}
      <Modal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type='text'
            className='form-control'
            placeholder='Nombre de la categoría'
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowCategoryModal(false)}
          >
            Cancelar
          </Button>
          <Button variant='primary' onClick={addNewCategory}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSeasonModal} onHide={() => setShowSeasonModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Temporada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type='text'
            className='form-control'
            placeholder='Nombre de la temporada'
            value={newSeason}
            onChange={e => setNewSeason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowSeasonModal(false)}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={addNewSeason}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      

      {/* Image Uploader Modal */}
      <ImageUploader
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
        onImageSelect={handleImageSelect}
        imageTag={galleryName}
      />
    </div>
  )
}

export default ProductForm
