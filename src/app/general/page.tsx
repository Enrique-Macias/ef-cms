

export default function GeneralPage() {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-text">
          <span>Inicio</span>
          <span className="mx-2">/</span>
          <span>General</span>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-title text-3xl mb-2">
          Información General
        </h1>
        <p className="font-metropolis font-normal text-text text-lg">
          Bienvenido, Alejandro
        </p>
      </div>

      {/* User Profile Section */}
      <div className="bg-white border border-stroke rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <img
              src="https://avatar.iran.liara.run/username?username=Alejandro+Medina&background=5A6F80&color=ffffff&size=80"
              alt="Alejandro Medina"
              className="h-20 w-20 rounded-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-metropolis font-semibold text-title text-xl mb-1">
              Alejandro Medina
            </h2>
            <p className="font-metropolis font-normal text-text text-lg mb-3">
              Administrador
            </p>
            <p className="font-metropolis font-normal text-text text-sm leading-relaxed">
              Este usuario tiene permisos para crear, editar y eliminar usuarios. También puede gestionar el contenido de la página de Escalando Fronteras.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="font-metropolis font-semibold text-title text-xl mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stroke rounded-lg p-6">
            <h3 className="font-metropolis font-normal text-text text-sm mb-2">Noticias Totales</h3>
            <p className="font-metropolis font-bold text-title text-3xl">12</p>
          </div>
          <div className="bg-white border border-stroke rounded-lg p-6">
            <h3 className="font-metropolis font-normal text-text text-sm mb-2">Eventos Totales</h3>
            <p className="font-metropolis font-bold text-title text-3xl">35</p>
          </div>
          <div className="bg-white border border-stroke rounded-lg p-6">
            <h3 className="font-metropolis font-normal text-text text-sm mb-2">Miembros Totales</h3>
            <p className="font-metropolis font-bold text-title text-3xl">8</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="font-metropolis font-semibold text-title text-xl mb-4">
          Actividad Reciente
        </h2>
        <div className="bg-white border border-stroke rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-stroke">
            <thead className="bg-stroke/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-metropolis font-semibold text-title uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-metropolis font-semibold text-title uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-metropolis font-semibold text-title uppercase tracking-wider">
                  Estatus
                </th>
                <th className="px-6 py-3 text-left text-xs font-metropolis font-semibold text-title uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stroke">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-title">
                  Design landing page
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  Noticia
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-metropolis font-medium bg-[#E8EDF5] text-title rounded-full">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  2024-08-15
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-title">
                  Implement user authentication
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  Noticia
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-metropolis font-medium bg-stroke text-text rounded-full">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  2024-07-20
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-title">
                  Write documentation
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  Evento
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-metropolis font-medium bg-stroke text-text rounded-full">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  2024-06-10
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-title">
                  Test application
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  Noticia
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-metropolis font-medium bg-[#E8EDF5] text-title rounded-full">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  2024-08-22
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-title">
                  Deploy to production
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
                  Testimonio
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-metropolis font-medium bg-stroke text-text rounded-full">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-metropolis font-normal text-text">
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
