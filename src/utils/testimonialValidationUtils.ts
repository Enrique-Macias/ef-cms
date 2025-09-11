import { TestimonialFormData, TestimonialFormDataEnglish } from '@/hooks/useTestimonialForm'

export function validateTestimonialForm(
  formData: TestimonialFormData,
  formDataEnglish: TestimonialFormDataEnglish
): { isValid: boolean; errorMessage?: string } {
  // Validate Spanish version
  if (!formData.author.trim()) {
    return { isValid: false, errorMessage: 'El nombre del autor es obligatorio' }
  }
  if (!formData.role.trim()) {
    return { isValid: false, errorMessage: 'El cargo/puesto es obligatorio' }
  }
  if (!formData.body.trim()) {
    return { isValid: false, errorMessage: 'El contenido del testimonio es obligatorio' }
  }
  if (!formData.image) {
    return { isValid: false, errorMessage: 'La imagen de perfil es obligatoria' }
  }

  // Validate English version
  if (!formDataEnglish.author.trim()) {
    return { isValid: false, errorMessage: 'Author name is required' }
  }
  if (!formDataEnglish.role.trim()) {
    return { isValid: false, errorMessage: 'Role/position is required' }
  }
  if (!formDataEnglish.body.trim()) {
    return { isValid: false, errorMessage: 'Testimonial content is required' }
  }
  if (!formDataEnglish.image) {
    return { isValid: false, errorMessage: 'Profile image is required' }
  }

  return { isValid: true }
}
