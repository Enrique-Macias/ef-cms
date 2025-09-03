
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useStats } from '@/hooks/useStats'

export default function GeneralPage() {
  const { user } = useAuth()
  const { news, events, users, loading, error } = useStats()

  // Function to get role-specific permissions description
  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Este usuario tiene permisos completos para crear, editar y eliminar usuarios, noticias, eventos, testimonios, artículos y miembros del equipo. También puede gestionar todo el contenido de la página de Escalando Fronteras.'
      case 'EDITOR':
        return 'Este usuario puede crear, editar y eliminar noticias, eventos, testimonios, artículos y miembros del equipo. No tiene permisos para gestionar otros usuarios.'
      default:
        return 'Este usuario tiene permisos limitados para ver el contenido de la página de Escalando Fronteras.'
    }
  }

  // Simulated general activity data
  const general_activity = [
    {
      id: 1,
      title: 'Design landing page',
      type: 'Noticia',
      status: 'In Progress',
      date: '2024-08-15'
    },
    {
      id: 2,
      title: 'Implement user authentication',
      type: 'Noticia',
      status: 'Completed',
      date: '2024-07-20'
    },
    {
      id: 3,
      title: 'Write documentation',
      type: 'Evento',
      status: 'Completed',
      date: '2024-06-10'
    },
    {
      id: 4,
      title: 'Test application',
      type: 'Noticia',
      status: 'In Progress',
      date: '2024-08-22'
    },
    {
      id: 5,
      title: 'Deploy to production',
      type: 'Testimonio',
      status: 'Completed',
      date: '2024-05-15'
    }
  ]

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
          <span>Inicio</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>General</span>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-4xl mb-2" style={{ color: '#0D141C' }}>
          Información General
        </h1>
        <p className="font-metropolis font-regular text-xl" style={{ color: '#4A739C' }}>
          Bienvenido, {user?.fullName || 'Usuario'}
        </p>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="bg-white border rounded-lg p-6 mb-8" style={{ borderColor: '#CFDBE8' }}>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <img
                src={user.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user.fullName)}`}
                alt={`Avatar de ${user.fullName}`}
                className="h-25 w-25 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              <div
                className="h-25 w-25 rounded-full bg-[#5A6F80] flex items-center justify-center text-white text-lg font-medium hidden"
                style={{ display: 'none' }}
              >
                {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-metropolis font-bold text-xl mb-1" style={{ color: '#0D141C' }}>
                {user.fullName}
              </h2>
              <p className="font-metropolis font-regular text-base mb-3" style={{ color: '#4A739C' }}>
                {user.role === 'ADMIN' ? 'Administrador' : 'Editor'}
              </p>
              <p className="font-metropolis font-regular text-base" style={{ color: '#4A739C' }}>
                {getRolePermissions(user.role)}
              </p>
            </div>
          </div> 
        </div>
      )}

      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
          Datos Generales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-text text-base mb-2">Noticias Totales</h3>
            <p className="font-metropolis font-bold text-title text-3xl">
              {loading ? '...' : error ? 'Error' : news?.total || 0}
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-text text-base mb-2">Eventos Totales</h3>
            <p className="font-metropolis font-bold text-title text-3xl">
              {loading ? '...' : error ? 'Error' : events?.total || 0}
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-text text-base mb-2">Miembros Totales</h3>
            <p className="font-metropolis font-bold text-title text-3xl">
              {loading ? '...' : error ? 'Error' : users?.total || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="font-metropolis font-semibold text-xl mb-4" style={{ color: '#0D141C' }}>
          Actividad Reciente
        </h2>
        <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
          <table className="min-w-full divide-y" style={{ borderColor: '#CFDBE8' }}>
            <thead className="bg-stroke/20">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Título
                </th>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Estatus
                </th>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y" style={{ borderColor: '#CFDBE8' }}>
              {general_activity.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {activity.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {activity.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-sm font-metropolis font-regular bg-[#E8EDF5] text-title rounded-full">
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {activity.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
