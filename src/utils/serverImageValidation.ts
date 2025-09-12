/**
 * Server-side image validation utilities for API routes
 * Validates base64 images before uploading to Cloudinary
 */

export interface ServerImageValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface ServerImageValidationOptions {
  maxSizeMB?: number;
  allowedFormats?: string[];
  maxQuantity?: number;
  isCoverImage?: boolean;
}

// Default validation options
const DEFAULT_OPTIONS: Required<ServerImageValidationOptions> = {
  maxSizeMB: 2,
  allowedFormats: ['jpg', 'jpeg', 'png'],
  maxQuantity: 5,
  isCoverImage: false
};

/**
 * Validates a base64 image string
 */
export function validateBase64Image(
  base64String: string,
  options: ServerImageValidationOptions = {}
): ServerImageValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Extract base64 data and metadata
    const [header, data] = base64String.split(',');
    if (!header || !data) {
      return {
        isValid: false,
        errorMessage: 'Formato de imagen base64 inválido'
      };
    }

    // Check MIME type from header
    const mimeMatch = header.match(/data:([^;]+)/);
    if (!mimeMatch) {
      return {
        isValid: false,
        errorMessage: 'Tipo MIME no encontrado en imagen base64'
      };
    }

    const mimeType = mimeMatch[1];
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      return {
        isValid: false,
        errorMessage: `Tipo de imagen no permitido: ${mimeType}. Tipos permitidos: ${allowedMimeTypes.join(', ')}`
      };
    }

    // Calculate file size from base64 data
    const sizeInBytes = (data.length * 3) / 4; // Base64 to bytes conversion
    const maxSizeBytes = opts.maxSizeMB * 1024 * 1024;

    if (sizeInBytes > maxSizeBytes) {
      return {
        isValid: false,
        errorMessage: `La imagen debe ser menor a ${opts.maxSizeMB}MB. Tamaño actual: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`
      };
    }

    return { isValid: true };

  } catch (error) {
    return {
      isValid: false,
      errorMessage: 'Error al procesar imagen base64'
    };
  }
}

/**
 * Validates multiple base64 images
 */
export function validateMultipleBase64Images(
  base64Strings: string[],
  options: ServerImageValidationOptions = {}
): ServerImageValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check quantity limit
  if (base64Strings.length > opts.maxQuantity) {
    return {
      isValid: false,
      errorMessage: `Máximo ${opts.maxQuantity} imágenes permitidas. Seleccionadas: ${base64Strings.length}`
    };
  }

  // Validate each image
  for (let i = 0; i < base64Strings.length; i++) {
    const validation = validateBase64Image(base64Strings[i], options);
    if (!validation.isValid) {
      return {
        isValid: false,
        errorMessage: `Imagen ${i + 1}: ${validation.errorMessage}`
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates images for different content types (server-side)
 */
export function validateServerImagesForContentType(
  contentType: 'news' | 'events' | 'team' | 'testimonials' | 'articles',
  images: string | string[],
  isCoverImage: boolean = false
): ServerImageValidationResult {
  const options: ServerImageValidationOptions = {
    maxSizeMB: 2,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    isCoverImage
  };

  switch (contentType) {
    case 'news':
    case 'events':
      // News and events can have multiple images
      options.maxQuantity = 5;
      return Array.isArray(images) 
        ? validateMultipleBase64Images(images, options)
        : validateBase64Image(images, options);

    case 'team':
    case 'testimonials':
    case 'articles':
      // Team, testimonials, and articles have single cover image
      options.maxQuantity = 1;
      return validateBase64Image(images as string, options);

    default:
      return {
        isValid: false,
        errorMessage: 'Tipo de contenido no válido'
      };
  }
}

/**
 * Extracts file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png'
  };
  
  return mimeToExt[mimeType] || '';
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
