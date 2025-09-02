import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility functions for Cloudinary
export const uploadImageFromBase64 = async (base64Data: string, folder: string = 'ef-cms'): Promise<string> => {
  try {
    // Remove the data URL prefix if present
    const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
      folder,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto:good' }
      ],
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const uploadImageFromFile = async (file: File, folder: string = 'ef-cms'): Promise<string> => {
  try {
    // Convert File to base64
    const base64 = await fileToBase64(file);
    return await uploadImageFromBase64(base64, folder);
  } catch (error) {
    console.error('File to base64 conversion error:', error);
    throw new Error('Failed to convert file to base64');
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export const getImageUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
}): string => {
  const transformation = [];
  
  if (options?.width && options?.height) {
    transformation.push(`w_${options.width},h_${options.height},c_${options.crop || 'fill'}`);
  }
  
  if (options?.quality) {
    transformation.push(`q_${options.quality}`);
  }
  
  const transformString = transformation.length > 0 ? `/${transformation.join('/')}` : '';
  
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload${transformString}/${publicId}`;
};

// Extract public ID from Cloudinary URL
export const extractPublicId = (url: string): string | null => {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload' and before the file extension
    const publicIdParts = urlParts.slice(uploadIndex + 1);
    const lastPart = publicIdParts[publicIdParts.length - 1];
    const extensionIndex = lastPart.lastIndexOf('.');
    
    if (extensionIndex !== -1) {
      publicIdParts[publicIdParts.length - 1] = lastPart.substring(0, extensionIndex);
    }
    
    return publicIdParts.join('/');
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

export default cloudinary;
