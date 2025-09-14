import type { Metadata } from 'next'
import './fonts/metropolis.css'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'EF CMS - Content Management System',
  description: 'Admin dashboard for managing content, users, and events',
  icons: {
    icon: [
      { url: '/images/branding/EF_LOGO.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/branding/EF_LOGO.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/images/branding/EF_LOGO.png',
    apple: '/images/branding/EF_LOGO.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-metropolis antialiased">
        <div className="min-h-screen bg-page">
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
