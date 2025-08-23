export default function ConfiguracionPage() {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-text">
          <span>Inicio</span>
          <span className="mx-2">/</span>
          <span>Configuración</span>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-title text-3xl mb-2">
          Configuración del Sistema
        </h1>
        <p className="font-metropolis font-normal text-text text-lg">
          Ajusta las configuraciones del sistema
        </p>
      </div>

      {/* Content will go here */}
      <div className="bg-white border border-stroke rounded-lg p-6">
        <p className="font-metropolis font-normal text-text">
          Contenido de configuración aquí...
        </p>
      </div>
    </div>
  )
}
