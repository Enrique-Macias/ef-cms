import { toast } from 'sonner'

export const useToast = () => {
  const success = (message: string) => {
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
  }

  const error = (message: string) => {
    toast.error(message, {
      style: {
        background: '#F7FAFC',
        color: '4A739C',
        border: '1px solid #CFDBE8',
        fontFamily: 'Metropolis, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const warning = (message: string) => {
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
  }

  const info = (message: string) => {
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
  }

  return {
    success,
    error,
    warning,
    info,
  }
}
