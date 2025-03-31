import { useState, useEffect } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { sepia } from "@cloudinary/url-gen/actions/effect";

// Cloudinary configuration
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function CloudinaryAssetManager({
  onSelect,
  onClose,
  multiple = false,
}) {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize Cloudinary instance
  const cld = new Cloudinary({
    cloud: {
      cloudName: cloudName,
    },
  });

  // Fetch images from Cloudinary API
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`
      );
      const data = await response.json();
      setImages(data.resources);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  // Handle file upload to Cloudinary
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadedData = await response.json();
      setImages([uploadedData, ...images]);
    } catch (error) {
      console.error("Upload error:", error);
    }
    setLoading(false);
  };

  // Handle image deletion from Cloudinary by public_id
  const handleDelete = async (publicId) => {
    try {
      await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/${publicId}`,
        {
          method: "DELETE",
        }
      );
      setImages(images.filter((img) => img.public_id !== publicId));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Handle image selection for single or multiple choices
  const handleSelect = (image) => {
    if (multiple) {
      setSelectedImages((prev) =>
        prev.includes(image.secure_url)
          ? prev.filter((url) => url !== image.secure_url)
          : [...prev, image.secure_url]
      );
    } else {
      setSelectedImages([image.secure_url]);
    }
  };

  // Confirm image selection and close modal
  const confirmSelection = () => {
    onSelect(selectedImages);
    onClose();
  };

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Images</h2>

        {/* File input for uploading new images */}
        <input type="file" onChange={handleUpload} />
        {loading && <p>Loading...</p>}

        <div className="image-grid">
          {/* Display images in a grid format */}
          {images.map((image) => {
            const myImage = cld.image(image.public_id);
            myImage.effect(sepia()); // Example of image transformation (sepia)

            return (
              <div
                key={image.public_id}
                className={`image-item ${
                  selectedImages.includes(image.secure_url) ? "selected" : ""
                }`}
              >
                {/* Use AdvancedImage component to render the transformed image */}
                <AdvancedImage cldImg={myImage} />

                {/* Select Image */}
                <button onClick={() => handleSelect(image)}>
                  {selectedImages.includes(image.secure_url)
                    ? "Deselect"
                    : "Select"}
                </button>

                {/* Delete Image */}
                <button onClick={() => handleDelete(image.public_id)}>
                  Delete
                </button>
              </div>
            );
          })}
        </div>

        {/* Confirmation and Close Buttons */}
        <button onClick={confirmSelection}>Confirm Selection</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
