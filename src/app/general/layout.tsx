import { Sidebar } from '@/components/general/Sidebar'

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-page">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-page pt-16 md:pt-0">
        <div className="px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
