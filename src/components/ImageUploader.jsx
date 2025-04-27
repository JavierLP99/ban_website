import React, { useState, useEffect } from 'react';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from '@cloudinary/react';
import axios from "axios";


const ImageUploader = ({ onImageSelect, showModal, onCloseModal, imageTag = 'gallery' }) => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 10;

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const cld = new Cloudinary({ cloud: { cloudName } });

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      if (imageTag !== '') {
        try {
          console.log(`We try with "${imageTag}"`);
          const response = await axios.get(
            `https://res.cloudinary.com/${cloudName}/image/list/${imageTag}.json`
          );
  
          const data = response.data;
          if (data.resources) {
            setImages(data.resources.map((img) => ({
              url: `https://res.cloudinary.com/${cloudName}/image/upload/${img.public_id}`,
              public_id: img.public_id,
            })));
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            setError("No se pudieron cargar las imágenes.");
          }
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchImages();
  }, [cloudName, imageTag]);
  
  

  const uploadImages = async (files) => {
    setLoading(true);
    console.log(files)
    try {
      const uploadedImages = await Promise.all(
        
        [...files].map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);
          formData.append('tags', imageTag);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            { method: 'POST', body: formData }
          );

          const data = await res.json();
          return { url: data.secure_url, public_id: data.public_id };
        })
      );

      setImages((prevImages) => [...uploadedImages, ...prevImages]);
    } catch (err) {
      setError("Error cargando imágenes.");
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (image) => {
    setSelectedImages((prevSelected) => {
      const isSelected = prevSelected.some((img) => img.public_id === image.public_id);
      if (isSelected) {
        return prevSelected.filter((img) => img.public_id !== image.public_id);
      } else {
        return [...prevSelected, image];
      }
    });
  };

  const confirmSelection = () => {
    onImageSelect(selectedImages.map((img) => img.url));
    onCloseModal();
  };

  // Pagination Logic
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const currentImages = images.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);

  return (
    <div className={`modal fade ${showModal ? "show d-block" : "d-none"}`} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Administrar imágenes</h5>
            <button type="button" className="btn-close" onClick={onCloseModal}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <input
                type="file"
                multiple
                accept="image/*"
                className="form-control"
                onChange={(e) => uploadImages(e.target.files)}
                disabled={loading}
              />
            </div>
            {loading && <div className="alert alert-info text-center">Cargando...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Image Grid with Pagination */}
            <div className="row">
              {currentImages.map((image) => {
                const selectedIndex = selectedImages.findIndex(img => img.public_id === image.public_id);
                return (
                  <div key={image.public_id} className="col-6 col-md-4 col-xl-3 mb-3 position-relative">
                    <div className={`card shadow-sm ${selectedIndex !== -1 ? 'border border-primary border-3' : ''}`}>
                      <AdvancedImage
                        cldImg={cld.image(image.public_id)}
                        className="card-img-top"
                        onClick={() => toggleImageSelection(image)}
                        style={{
                          cursor: "pointer",
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          aspectRatio: "1/1"
                        }}
                      />
                      {selectedIndex !== -1 && (
                        <div className="position-absolute top-0 start-0 bg-primary text-white px-2 py-1 rounded">
                          {selectedIndex + 1}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
              <button
                type='button'
                className="btn btn-outline-secondary me-2"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previa
              </button>
              <span className="align-self-center">Página {currentPage} de {totalPages}</span>
              <button
              type='button'
                className="btn btn-outline-secondary ms-2"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={confirmSelection} type='button'>Selecciona imágenes</button>
            <button className="btn btn-secondary" onClick={onCloseModal} type='button'>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
