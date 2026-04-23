/**
 * Utilities for image handling and compression
 */

/**
 * Compresses an image base64 string by drawing it to a canvas and reducing quality.
 * This is essential for saving to localStorage and preventing memory issues.
 */
export async function compressImage(base64: string, maxWidth = 1200, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let width = img.width
      let height = img.height

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) return resolve(base64)

      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to compressed jpeg or webp for smaller size
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.onerror = (err) => reject(err)
  })
}
