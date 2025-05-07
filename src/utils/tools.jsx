/**
 * Cloudinary Image URL Transformer
 *
 * @param {string} originalUrl - Full Cloudinary image URL
 * @param {string} transformation - Cloudinary transformation string (e.g., "w_300", "w_100,h_100,c_fill")
 * @returns {string} - Transformed Cloudinary URL with the specified parameters
 *
 * Notes:
 * - Cloudinary URLs follow the format: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<public_id>
 * - This function injects the transformation string right after "upload/"
 */
export function getResizedCloudinaryUrl (originalUrl, transformation) {
  if (!originalUrl) {
    return ''
  } else {
    const parts = originalUrl.split('/upload/')
    if (parts.length !== 2) return originalUrl // fallback if format is unexpected
    return `${parts[0]}/upload/${transformation}/${parts[1]}`
  }
}

/**
 * Get a thumbnail with width 150px
 * Usage: Small preview in product list
 */
export function getThumbnailUrl (originalUrl) {
  return getResizedCloudinaryUrl(originalUrl, 't_Small')
}

/**
 * Get a square cropped preview (100x100px)
 * Usage: Grid gallery thumbnails
 */
export function getSquarePreviewUrl (originalUrl) {
  return getResizedCloudinaryUrl(originalUrl, 'w_100,h_100,c_fill')
}
//https://res.cloudinary.com/drnge8otv/image/upload/c_thumb,w_200,g_face/v1743696071/banner2_vorefs.png
/**
 * Get a web-optimized image: 600px wide, auto quality and format
 * Usage: Product detail view
 */
export function getOptimizedImageUrl (originalUrl) {
  return getResizedCloudinaryUrl(originalUrl, 't_MidSize')
}

export function getInvalid (originalUrl) {
  return getResizedCloudinaryUrl(originalUrl, 'w_300,h_300,c_fill,e_grayscale')
}

export function handleImageError (event) {
  event.target.src =
    'https://res.cloudinary.com/drnge8otv/image/upload/t_MidSize/v1745423218/Default_tjxbsn.png'
}
