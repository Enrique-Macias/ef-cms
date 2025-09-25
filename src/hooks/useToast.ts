import { toast } from 'sonner'
import { useCallback } from 'react'

export const useToast = () => {
  const success = useCallback((message: string) => {
    toast.success(message, {
      style: {
        background: '#F7FAFC',
        color: '#4A739C',
        border: '1px solid #CFDBE8',
        fontFamily: 'Metropolis, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }, [])

  const error = useCallback((message: string) => {
    toast.error(message, {
      style: {
        background: '#F7FAFC',
        color: '#4A739C',
        border: '1px solid #CFDBE8',
        fontFamily: 'Metropolis, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }, [])

  const warning = useCallback((message: string) => {
    toast.warning(message, {
      style: {
        background: '#F7FAFC',
        color: '#4A739C',
        border: '1px solid #CFDBE8',
        fontFamily: 'Metropolis, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }, [])

  const info = useCallback((message: string) => {
    toast.info(message, {
      style: {
        background: '#F7FAFC',
        color: '#4A739C',
        border: '1px solid #CFDBE8',
        fontFamily: 'Metropolis, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }, [])

  return {
    success,
    error,
    warning,
    info,
  }
}
