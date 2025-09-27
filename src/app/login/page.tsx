'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { AuthBackground } from '@/components/ui/AuthBackground'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const toast = useToast()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/general')
    }
  }, [isAuthenticated, router])

  // Don't render the form if already authenticated
  if (isAuthenticated) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Sesión iniciada exitosamente')
        router.replace('/general')
      } else {
        toast.error(result.error || 'Credenciales inválidas')
      }
    } catch (error) {
      toast.error('Error de conexión')
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

      {/* Login Form */}
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="pb-6">
          {/* Form Logo */}
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          
          <h1 className="font-metropolis font-semibold text-2xl mb-2 text-left" style={{ color: '#313131' }}>
            Iniciar Sesión
          </h1>
          
          <p className="font-metropolis font-normal text-sm text-left" style={{ color: '#313131' }}>
            Ingresa las credenciales los cuales el administrador te otorgó
          </p>
        </CardHeader>

        <CardContent>
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
                placeholder="john.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-metropolis font-normal border-stroke focus:border-button focus:ring-button/20"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="font-metropolis font-semibold text-title text-sm"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-metropolis font-normal border-stroke focus:border-button focus:ring-button/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-title transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>


            {/* Forgot Password Link */}
            <div className="text-left" style={{ marginTop: '5px' }}>
              <Link 
                href="/forgot-password"
                className="font-metropolis font-normal text-sm hover:text-button transition-colors"
                style={{ color: '#4F4F4F' }}
              >
                ¿Olvidaste la contraseña?
              </Link>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full font-metropolis font-semibold transition-all duration-200"
              style={{
                backgroundColor: '#5A6F80',
                color: '#FFFDF6'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#4A5A6B'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#5A6F80'
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" />
                  <span className="ml-2">Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthBackground>
  )
}
