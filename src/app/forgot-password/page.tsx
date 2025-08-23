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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('alejandro@admin.com')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password reset logic
    console.log('Password reset requested for:', email)
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
                placeholder="alejandro@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-metropolis font-normal border-stroke focus:border-button focus:ring-button/20"
                required
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full font-metropolis font-semibold transition-colors"
              style={{
                backgroundColor: '#5A6F80',
                color: '#FFFDF6'
              }}
            >
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthBackground>
  )
}
