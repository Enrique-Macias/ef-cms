'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UsersIcon, 
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Inicio', href: '/general', icon: HomeIcon },
  { name: 'Gestión', href: '/general/gestion', icon: FolderIcon, hasDropdown: true },
  { name: 'Usuarios', href: '/general/usuarios', icon: UsersIcon },
  { name: 'Actividad', href: '/general/actividad', icon: ChartBarIcon },
  { name: 'Configuración', href: '/general/configuracion', icon: Cog6ToothIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="bg-white p-2 rounded-md text-text hover:text-title focus:outline-none focus:ring-2 focus:ring-inset focus:ring-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out md:flex md:w-60 md:flex-col`}>
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-stroke shadow-lg">
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end p-4">
            <button
              type="button"
              className="text-text hover:text-title"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* User Profile Section */}
            <div className="px-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src="https://avatar.iran.liara.run/username?username=Alejandro&background=5A6F80&color=ffffff&size=40"
                    alt="Alejandro"
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-metropolis font-semibold text-title text-sm">Alejandro</p>
                  <p className="font-metropolis font-normal text-text text-xs">Administrador</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-metropolis font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#E8EDF5] text-title'
                        : 'text-text hover:bg-stroke/20 hover:text-title'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-title' : 'text-text group-hover:text-title'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.hasDropdown && (
                      <svg 
                        className="h-4 w-4 text-text" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Logout Section */}
          <div className="flex-shrink-0 flex border-t border-stroke p-4">
            <Link 
              href="/login"
              className="flex items-center w-full px-3 py-2 text-sm font-metropolis font-medium text-text hover:text-title hover:bg-stroke/20 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
