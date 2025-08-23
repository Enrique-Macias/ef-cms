import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white'
  className?: string
}

export function Logo({ size = 'md', variant = 'default', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const textColor = variant === 'white' ? 'text-white' : 'text-title'

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} relative`}>
        <Image 
          src="/images/branding/EF_LOGO.png"
          alt="Escalando Fronteras Logo"
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Text */}
      <div className={`font-metropolis font-bold ${textSizes[size]} ${textColor}`}>
        ESCALANDO FRONTERAS
      </div>
    </div>
  )
}
