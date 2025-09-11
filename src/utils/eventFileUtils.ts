// Helper function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Helper function to get image source for preview
export const getImageSrc = (file: File | null): string | null => {
  if (!file) return null
  return URL.createObjectURL(file)
}
