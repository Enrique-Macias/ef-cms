'use client'

import { useState } from 'react'
import { Logo } from '@/components/ui/Logo'
import { AuthBackground } from '@/components/ui/AuthBackground'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

export default function ConfigurePasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password configuration logic
    console.log('Password configuration:', { password, confirmPassword })
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
            Configura tu contraseña
          </h1>
          
          <p className="font-metropolis font-normal text-sm text-left" style={{ color: '#313131' }}>
            Tu contraseña pasada esta deshabilitada. Por favor ingrese una nueva contraseña para su cuenta.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Create Password Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="font-metropolis font-semibold text-title text-sm"
              >
                Crear contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="7789BM6X@@H&$K_"
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
                  placeholder="7789BM6X@@H&$K_"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="font-metropolis font-normal border-stroke focus:border-button focus:ring-button/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-title transition-colors"
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
              className="w-full font-metropolis font-semibold transition-colors"
              style={{
                backgroundColor: '#5A6F80',
                color: '#FFFDF6'
              }}
            >
              Establecer Contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthBackground>
  )
}
