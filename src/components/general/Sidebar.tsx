'use client'

import React, { useState, useEffect } from 'react'
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
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  FolderIcon as FolderIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  NewspaperIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/solid'

const navigation = [
  { name: 'Inicio', href: '/general', icon: HomeIcon, iconSolid: HomeIconSolid },
  { 
    name: 'Gestión', 
    href: '/general/gestion', 
    icon: FolderIcon, 
    iconSolid: FolderIconSolid,
    hasDropdown: true,
    submenu: [
      { name: 'Noticias', href: '/general/gestion/noticias', icon: NewspaperIcon },
      { name: 'Eventos', href: '/general/gestion/eventos', icon: CalendarIcon },
      { name: 'Testimonios', href: '/general/gestion/testimonios', icon: ChatBubbleLeftRightIcon },
      { name: 'Equipo', href: '/general/gestion/equipo', icon: UserGroupIcon },
      { name: 'Artículos', href: '/general/gestion/articulos', icon: DocumentTextIcon },
    ]
  },
  { name: 'Usuarios', href: '/general/usuarios', icon: UsersIcon, iconSolid: UsersIconSolid },
  { name: 'Actividad', href: '/general/actividad', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
  { name: 'Configuración', href: '/general/configuracion', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Auto-open dropdown if current page is in a submenu
  useEffect(() => {
    const currentItem = navigation.find(item => 
      item.submenu?.some(subItem => pathname === subItem.href)
    )
    if (currentItem) {
      setOpenDropdown(currentItem.name)
    }
  }, [pathname])

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
                    src="https://avatar.iran.liara.run/username?username=Alejandro Medina"
                    alt="Alejandro"
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-metropolis font-regular text-base" style={{ color: '#0D141C' }}>Alejandro</p>
                  <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>Administrador</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const isDropdownOpen = openDropdown === item.name
                const hasActiveSubmenu = item.submenu?.some(subItem => pathname === subItem.href)
                
                return (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div
                        className={`group flex items-center px-3 py-2 text-sm font-metropolis font-regular rounded-lg transition-colors cursor-pointer ${
                          isActive || hasActiveSubmenu
                            ? 'bg-[#E8EDF5]'
                            : 'hover:bg-stroke/20'
                        }`}
                        style={{ color: '#0D141C' }}
                        onClick={() => {
                          setOpenDropdown(openDropdown === item.name ? null : item.name)
                        }}
                      >
                        {(isActive || hasActiveSubmenu) && item.iconSolid ? (
                          <item.iconSolid
                            className="mr-3 flex-shrink-0 h-5 w-5 text-title"
                            aria-hidden="true"
                          />
                        ) : (
                          <item.icon
                            className={`mr-3 flex-shrink-0 h-5 w-5 ${
                              isActive || hasActiveSubmenu ? 'text-title' : 'text-text group-hover:text-title'
                            }`}
                            aria-hidden="true"
                          />
                        )}
                        <span className="flex-1">{item.name}</span>
                        {isDropdownOpen ? (
                          <ChevronUpIcon className="h-4 w-4 text-text" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-text" />
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-metropolis font-regular rounded-lg transition-colors ${
                          isActive || hasActiveSubmenu
                            ? 'bg-[#E8EDF5]'
                            : 'hover:bg-stroke/20'
                        }`}
                        style={{ color: '#0D141C' }}
                      >
                        {(isActive || hasActiveSubmenu) && item.iconSolid ? (
                          <item.iconSolid
                            className="mr-3 flex-shrink-0 h-5 w-5 text-title"
                            aria-hidden="true"
                          />
                        ) : (
                          <item.icon
                            className={`mr-3 flex-shrink-0 h-5 w-5 ${
                              isActive || hasActiveSubmenu ? 'text-title' : 'text-text group-hover:text-title'
                            }`}
                            aria-hidden="true"
                          />
                        )}
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    )}
                    
                    {/* Submenu */}
                    {item.hasDropdown && isDropdownOpen && item.submenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const isSubActive = pathname === subItem.href
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`group flex items-center px-3 py-2 text-sm font-metropolis font-regular rounded-lg transition-colors ${
                                isSubActive
                                  ? 'bg-[#5A6F80] text-button-text'
                                  : 'hover:bg-stroke/20'
                              }`}
                              style={{ color: isSubActive ? '#FFFDF6' : '#0D141C' }}
                            >
                              <subItem.icon
                                className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                  isSubActive ? 'text-button-text' : 'text-text group-hover:text-title'
                                }`}
                                aria-hidden="true"
                              />
                              <span className="flex-1">{subItem.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Logout Section */}
          <div className="flex-shrink-0 flex border-t border-stroke p-4">
            <Link 
              href="/login"
              className="flex items-center w-full px-3 py-2 text-sm font-metropolis font-regular hover:bg-stroke/20 rounded-lg transition-colors"
            style={{ color: '#0D141C' }}
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
