export default function GestionPage() {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-text">
          <span>Inicio</span>
          <span className="mx-2">/</span>
          <span>Gestión</span>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-title text-3xl mb-2">
          Gestión de Contenido
        </h1>
        <p className="font-metropolis font-normal text-text text-lg">
          Administra noticias, eventos y testimonios
        </p>
      </div>

      {/* Content will go here */}
      <div className="bg-white border border-stroke rounded-lg p-6">
        <p className="font-metropolis font-normal text-text">
          Contenido de gestión aquí...
        </p>
      </div>
    </div>
  )
}
