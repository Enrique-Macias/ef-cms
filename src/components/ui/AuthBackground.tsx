interface AuthBackgroundProps {
  children: React.ReactNode
  backgroundImage: string
  className?: string
}

export function AuthBackground({ children, backgroundImage, className = '' }: AuthBackgroundProps) {
  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      
      {/* Dark Overlay (60% opacity) */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
