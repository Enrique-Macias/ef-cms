// File utilities for testimonials
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

export const getImageSrc = (image: File | string | null): string => {
  if (!image) return ''
  if (image instanceof File) return URL.createObjectURL(image)
  return image
}
