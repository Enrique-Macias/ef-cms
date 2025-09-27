'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D141C] to-[#1A2332] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" variant="white" />
        </div>

        {/* 404 Content */}
        <div className="mb-8">
          <h1 className="font-metropolis font-bold text-9xl mb-4 text-white">
            404
          </h1>
          <div className="w-16 h-0.5 bg-[#4A739C] mx-auto mb-6"></div>
          <h2 className="font-metropolis font-semibold text-2xl mb-4 text-white">
            Página no encontrada
          </h2>
          <p className="font-metropolis font-regular text-lg text-[#B8C5D1] max-w-md mx-auto">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 border border-[#4A739C] rounded-md shadow-sm text-sm font-metropolis font-medium text-[#4A739C] bg-transparent hover:bg-[#4A739C] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A739C] transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver atrás
          </button>
          
          <Link
            href="/general"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-metropolis font-medium text-white bg-[#5A6F80] hover:bg-[#4A5A6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al inicio
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <p className="font-metropolis font-regular text-sm text-[#8A9BA8] mb-4">
            ¿Necesitas ayuda?
          </p>
          <Link
            href="/login"
            className="font-metropolis font-medium text-sm text-[#4A739C] hover:text-[#5A6F80] transition-colors duration-200"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
