import { z } from 'zod';

// User validation schemas
export const userCreateSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'EDITOR']).default('EDITOR'),
});

export const userUpdateSchema = userCreateSchema.partial().omit({ password: true });

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const userChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// Event validation schemas
export const eventCreateSchema = z.object({
  title_es: z.string().min(1, 'Spanish title is required'),
  title_en: z.string().min(1, 'English title is required'),
  body_es: z.string().min(1, 'Spanish body is required'),
  body_en: z.string().min(1, 'English body is required'),
  date: z.string().datetime('Invalid date format'),
  tags: z.array(z.string()).default([]),
  tags_en: z.array(z.string()).default([]),
  category: z.string().min(1, 'Category is required'),
  category_en: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  location_city: z.string().min(1, 'City is required'),
  location_country: z.string().min(1, 'Country is required'),
  coverImageUrl: z.string().min(1, 'Cover image is required'),
  phrase: z.string().optional(),
  phrase_en: z.string().optional(),
  credits: z.string().min(1, 'Credits are required'),
  credits_en: z.string().optional(),
});

export const eventUpdateSchema = eventCreateSchema.partial();

// News validation schemas
export const newsCreateSchema = z.object({
  title_es: z.string().min(1, 'Spanish title is required'),
  title_en: z.string().min(1, 'English title is required'),
  body_es: z.string().min(1, 'Spanish body is required'),
  body_en: z.string().min(1, 'English body is required'),
  date: z.string().datetime('Invalid date format'),
  tags: z.array(z.string()).default([]),
  tags_en: z.array(z.string()).default([]),
  category: z.string().min(1, 'Category is required'),
  category_en: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  location_city: z.string().min(1, 'City is required'),
  location_country: z.string().min(1, 'Country is required'),
  coverImageUrl: z.string().min(1, 'Cover image is required'),
});

export const newsUpdateSchema = newsCreateSchema.partial();

// Testimonial validation schemas
export const testimonialCreateSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  role: z.string().min(1, 'Role is required'),
  body_es: z.string().min(1, 'Spanish body is required'),
  body_en: z.string().min(1, 'English body is required'),
  imageUrl: z.string().min(1, 'Image is required'),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();

// Image validation schemas
export const imageUploadSchema = z.object({
  order: z.number().int().min(0).optional(),
});

// Password reset schemas
export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
