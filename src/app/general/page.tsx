

export default function GeneralPage() {
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
          Bienvenido, Alejandro
        </p>
      </div>

      {/* User Profile Section */}
      <div className="bg-white border rounded-lg p-6 mb-8" style={{ borderColor: '#CFDBE8' }}>
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <img
              src="https://avatar.iran.liara.run/username?username=Alejandro Medina"
              alt="Alejandro Medina"
              className="h-25 w-25 rounded-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-metropolis font-bold text-xl mb-1" style={{ color: '#0D141C' }}>
              Alejandro Medina
            </h2>
            <p className="font-metropolis font-regular text-base mb-3" style={{ color: '#4A739C' }}>
              Administrador
            </p>
            <p className="font-metropolis font-regular text-base" style={{ color: '#4A739C' }}>
              Este usuario tiene permisos para crear, editar y eliminar usuarios. También puede gestionar el contenido de la página de Escalando Fronteras.
            </p>
          </div>
        </div> 
      </div>

      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
          Datos Generales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-text text-base mb-2">Noticias Totales</h3>
            <p className="font-metropolis font-bold text-title text-3xl">12</p>
          </div>
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-text text-base mb-2">Eventos Totales</h3>
            <p className="font-metropolis font-bold text-title text-3xl">35</p>
          </div>
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-text text-base mb-2">Miembros Totales</h3>
            <p className="font-bold text-title text-3xl">8</p>
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Design landing page
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  Noticia
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-sm font-metropolis font-regular bg-[#E8EDF5] text-title rounded-full">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  2024-08-15
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Implement user authentication
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  Noticia
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-sm font-metropolis font-regular bg-[#E8EDF5] text-text rounded-full">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  2024-07-20
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Write documentation
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  Evento
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-sm font-metropolis font-regular bg-[#E8EDF5] text-text rounded-full">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  2024-06-10
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Test application
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  Noticia
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-sm font-metropolis font-regular bg-[#E8EDF5] text-text rounded-full">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  2024-08-22
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Deploy to production
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  Testimonio
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-sm font-metropolis font-regular bg-[#E8EDF5] text-text rounded-full">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  2024-05-15
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
