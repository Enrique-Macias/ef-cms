export default function UsuariosPage() {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-text">
          <span>Inicio</span>
          <span className="mx-2">/</span>
          <span>Usuarios</span>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-title text-3xl mb-2">
          Gestión de Usuarios
        </h1>
        <p className="font-metropolis font-normal text-text text-lg">
          Administra los usuarios del sistema
        </p>
      </div>

      {/* Content will go here */}
      <div className="bg-white border border-stroke rounded-lg p-6">
        <p className="font-metropolis font-normal text-text">
          Contenido de gestión de usuarios aquí...
        </p>
      </div>
    </div>
  )
}
