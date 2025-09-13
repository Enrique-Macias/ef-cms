'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { AuthBackground } from '@/components/ui/AuthBackground'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

function ConfigurePasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error('Token de restablecimiento no válido')
        router.push('/forgot-password')
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setIsValidToken(true)
          setUserEmail(data.email)
        } else {
          toast.error(data.error || 'Token inválido')
          router.push('/forgot-password')
        }
      } catch (error) {
        console.error('Error validating token:', error)
        toast.error('Error de conexión')
        router.push('/forgot-password')
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success('Contraseña restablecida exitosamente')
      } else {
        toast.error(data.error || 'Error al restablecer la contraseña')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <AuthBackground backgroundImage="/images/backgrounds/login-bg.jpeg">
        <div className="absolute top-6 left-6 z-20">
          <Logo size="md" variant="white" />
        </div>
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A6F80] mx-auto mb-4"></div>
              <p className="font-metropolis font-normal text-sm" style={{ color: '#4A739C' }}>
                Validando token...
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthBackground>
    )
  }

  if (!isValidToken) {
    return null
  }

  return (
    <AuthBackground backgroundImage="/images/backgrounds/login-bg.jpeg">
      {/* Header Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Logo size="md" variant="white" />
      </div>

      {/* Password Configuration Form */}
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="pb-6">
          {/* Form Logo */}
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          
          <h1 className="font-metropolis font-semibold text-2xl mb-2 text-left" style={{ color: '#313131' }}>
            Restablecer contraseña
          </h1>
          
          <p className="font-metropolis font-normal text-sm text-left" style={{ color: '#313131' }}>
            Ingresa una nueva contraseña para tu cuenta: <strong>{userEmail}</strong>
          </p>
        </CardHeader>

        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Create Password Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="font-metropolis font-semibold text-title text-sm"
                >
                  Nueva contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-metropolis font-normal border-stroke focus:border-button focus:ring-button/20 pr-10"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-title transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="confirmPassword" 
                  className="font-metropolis font-semibold text-title text-sm"
                >
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="font-metropolis font-normal border-stroke focus:border-button focus:ring-button/20 pr-10"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-title transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Set Password Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full font-metropolis font-semibold transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: '#5A6F80',
                  color: '#FFFDF6'
                }}
              >
                {isLoading ? 'Estableciendo...' : 'Establecer Contraseña'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-metropolis font-semibold text-lg" style={{ color: '#0D141C' }}>
                ¡Contraseña Restablecida!
              </h3>
              <p className="font-metropolis font-normal text-sm" style={{ color: '#4A739C' }}>
                Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full font-metropolis font-semibold transition-colors"
                  style={{
                    backgroundColor: '#5A6F80',
                    color: '#FFFDF6'
                  }}
                >
                  Ir a Iniciar Sesión
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthBackground>
  )
}

export default function ConfigurePasswordPage() {
  return (
    <Suspense fallback={
      <AuthBackground backgroundImage="/images/backgrounds/login-bg.jpeg">
        <div className="absolute top-6 left-6 z-20">
          <Logo size="md" variant="white" />
        </div>
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A6F80] mx-auto mb-4"></div>
              <p className="font-metropolis font-normal text-sm" style={{ color: '#4A739C' }}>
                Cargando...
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthBackground>
    }>
      <ConfigurePasswordForm />
    </Suspense>
  )
}
