/**
 * Image validation utilities for file size, format, and quantity limits
 */

export interface ImageValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface ImageValidationOptions {
  maxSizeMB?: number;
  allowedFormats?: string[];
  maxQuantity?: number;
  isCoverImage?: boolean;
}

// Default validation options
const DEFAULT_OPTIONS: Required<ImageValidationOptions> = {
  maxSizeMB: 2,
  allowedFormats: ['jpg', 'jpeg', 'png'],
  maxQuantity: 5,
  isCoverImage: false
};

/**
 * Validates a single image file
 */
export function validateSingleImage(
  file: File,
  options: ImageValidationOptions = {}
): ImageValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check file size (convert MB to bytes)
  const maxSizeBytes = opts.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      errorMessage: `La imagen debe ser menor a ${opts.maxSizeMB}MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    };
  }

  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !opts.allowedFormats.includes(fileExtension)) {
    return {
      isValid: false,
      errorMessage: `Formato no permitido. Formatos permitidos: ${opts.allowedFormats.join(', ')}`
    };
  }

  // Check MIME type as additional validation
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png'
  ];
  
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      errorMessage: `Tipo de archivo no permitido. Tipos permitidos: ${allowedMimeTypes.join(', ')}`
    };
  }

  return { isValid: true };
}

/**
 * Validates multiple images (for galleries)
 */
export function validateMultipleImages(
  files: File[],
  options: ImageValidationOptions = {}
): ImageValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check quantity limit
  if (files.length > opts.maxQuantity) {
    return {
      isValid: false,
      errorMessage: `Máximo ${opts.maxQuantity} imágenes permitidas. Seleccionadas: ${files.length}`
    };
  }

  // Validate each image
  for (let i = 0; i < files.length; i++) {
    const validation = validateSingleImage(files[i], options);
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
 * Validates images for different content types
 */
export function validateImagesForContentType(
  contentType: 'news' | 'events' | 'team' | 'testimonials' | 'articles',
  files: File | File[],
  isCoverImage: boolean = false
): ImageValidationResult {
  const options: ImageValidationOptions = {
    maxSizeMB: 2,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    isCoverImage
  };

  switch (contentType) {
    case 'news':
    case 'events':
      // News and events can have multiple images
      options.maxQuantity = 5;
      return Array.isArray(files) 
        ? validateMultipleImages(files, options)
        : validateSingleImage(files, options);

    case 'team':
    case 'testimonials':
    case 'articles':
      // Team, testimonials, and articles have single cover image
      options.maxQuantity = 1;
      return validateSingleImage(files as File, options);

    default:
      return {
        isValid: false,
        errorMessage: 'Tipo de contenido no válido'
      };
  }
}

/**
 * Converts file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Checks if file extension is allowed
 */
export function isAllowedFormat(filename: string, allowedFormats: string[] = ['jpg', 'jpeg', 'png']): boolean {
  const extension = getFileExtension(filename);
  return allowedFormats.includes(extension);
}
