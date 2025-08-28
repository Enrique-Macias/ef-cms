import type { Metadata } from 'next'
import './fonts/metropolis.css'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'EF CMS - Content Management System',
  description: 'Admin dashboard for managing content, users, and events',
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
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  )
}
