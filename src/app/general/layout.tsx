import { Sidebar } from '@/components/general/Sidebar'
import { Spinner } from '@/components/ui/spinner'
import { Suspense } from 'react'

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Spinner size="lg" />
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}
