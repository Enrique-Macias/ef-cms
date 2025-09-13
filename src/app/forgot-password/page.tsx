'use client'

import { useState } from 'react'
import { Logo } from '@/components/ui/Logo'
import { AuthBackground } from '@/components/ui/AuthBackground'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Por favor ingresa tu correo electrónico')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Error al enviar el correo')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthBackground backgroundImage="/images/backgrounds/login-bg.jpeg">
      {/* Header Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Logo size="md" variant="white" />
      </div>

      {/* Forgot Password Form */}
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="pb-6">
          {/* Form Logo */}
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          
          {/* Back to Login Link */}
          <div className="mb-4 text-left">
            <Link 
              href="/login"
              className="inline-flex items-center font-metropolis font-normal text-text text-sm hover:text-button transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar a Iniciar Sesión
            </Link>
          </div>
          
          <h1 className="font-metropolis font-semibold text-2xl mb-2 text-left" style={{ color: '#313131' }}>
            ¿Olvidaste tu contraseña?
          </h1>
          
          <p className="font-metropolis font-normal text-sm text-left" style={{ color: '#313131' }}>
            No te preocupes, le pasa a cualquiera de nosotros. Ingresa tu correo electrónico en el recuadro de abajo para recuperar tu contraseña.
          </p>
        </CardHeader>

        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="font-metropolis font-semibold text-title text-sm"
                >
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-metropolis font-normal border-stroke focus:border-button focus:ring-button/20"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full font-metropolis font-semibold transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: '#5A6F80',
                  color: '#FFFDF6'
                }}
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
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
                ¡Correo Enviado!
              </h3>
              <p className="font-metropolis font-normal text-sm" style={{ color: '#4A739C' }}>
                Si el correo electrónico existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
              </p>
              <div className="pt-4">
                <Link 
                  href="/login"
                  className="inline-flex items-center font-metropolis font-normal text-text text-sm hover:text-button transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthBackground>
  )
}
