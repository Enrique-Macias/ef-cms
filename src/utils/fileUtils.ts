// Convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Helper function to get image source
export const getImageSrc = (image: File | string | null): string => {
  if (!image) return ''
  if (image instanceof File) return URL.createObjectURL(image)
  return image
}
