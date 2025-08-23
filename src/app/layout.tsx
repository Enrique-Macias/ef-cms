import type { Metadata } from 'next'
import './fonts/metropolis.css'
import './globals.css'

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
        </div>
      </body>
    </html>
  )
}
