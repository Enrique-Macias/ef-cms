'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
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
  ChevronDownIcon,
  NewspaperIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  HeartIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  FolderIcon as FolderIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  CalendarIcon as CalendarIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  GlobeAltIcon as GlobeAltIconSolid
} from '@heroicons/react/24/solid'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>
  hasDropdown?: boolean
  submenu?: NavigationItem[]
  adminOnly?: boolean
}

const navigation: NavigationItem[] = [
  { name: 'Inicio', href: '/general', icon: HomeIcon, iconSolid: HomeIconSolid },
  { 
    name: 'Gestión', 
    href: '/general/gestion', 
    icon: FolderIcon, 
    iconSolid: FolderIconSolid,
    hasDropdown: true,
    submenu: [
      { name: 'Noticias', href: '/general/gestion/noticias', icon: NewspaperIcon, iconSolid: NewspaperIconSolid },
      { name: 'Eventos', href: '/general/gestion/eventos', icon: CalendarIcon, iconSolid: CalendarIconSolid },
      { name: 'Testimonios', href: '/general/gestion/testimonios', icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid },
      { name: 'Equipo', href: '/general/gestion/equipo', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
      { name: 'Fundadores', href: '/general/gestion/fundadores', icon: StarIcon, iconSolid: StarIconSolid },
      { name: 'Artículos', href: '/general/gestion/articulos', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
      { name: 'Patrocinadores', href: '/general/gestion/patrocinadores', icon: BuildingOfficeIcon, iconSolid: BuildingOfficeIconSolid },
      { name: 'Apoyo', href: '/general/gestion/apoyo', icon: HeartIcon, iconSolid: HeartIconSolid },
    ]
  },
  { name: 'Global', href: '/general/global', icon: GlobeAltIcon, iconSolid: GlobeAltIconSolid },
  { name: 'Usuarios', href: '/general/usuarios', icon: UsersIcon, iconSolid: UsersIconSolid, adminOnly: true },
  { name: 'Actividad', href: '/general/actividad', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
  { name: 'Configuración', href: '/general/configuracion', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { logout, user } = useAuth()

  // Auto-open dropdown if current page is in a submenu
  useEffect(() => {
    const currentItem = navigation.find(item => 
      item.submenu?.some(subItem => 
        pathname === subItem.href || pathname.startsWith(subItem.href + '/')
      )
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

      {/* Mobile sidebar overlay - removed black background */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)} />
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
            {user && (
              <div className="px-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={user.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user.fullName)}`}
                      alt={`Avatar de ${user.fullName}`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                    <div
                      className="h-10 w-10 rounded-full bg-[#5A6F80] flex items-center justify-center text-white text-sm font-medium hidden"
                      style={{ display: 'none' }}
                    >
                      {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  </div>
                  <div>
                    <p className="font-metropolis font-regular text-base" style={{ color: '#0D141C' }}>{user.fullName}</p>
                    <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
                      {user.role === 'ADMIN' ? 'Administrador' : 'Editor'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                // Skip admin-only items for non-admin users
                if (item.adminOnly && user?.role !== 'ADMIN') {
                  return null
                }
                
                const isActive = pathname === item.href
                const isDropdownOpen = openDropdown === item.name
                const hasActiveSubmenu = item.submenu?.some(subItem => 
                  pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                )
                
                return (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div
                        className={`group flex items-center px-3 py-2 text-sm font-metropolis font-regular rounded-lg transition-colors cursor-pointer ${
                          isActive || hasActiveSubmenu
                            ? 'bg-[#E8EDF5]'
                            : 'hover:bg-[#E8EDF5]'
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
                            : 'hover:bg-[#E8EDF5]'
                        }`}
                        style={{ color: '#0D141C' }}
                        onClick={() => setMobileMenuOpen(false)}
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
                          const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`group flex items-center px-3 py-2 text-sm font-metropolis font-regular rounded-lg transition-colors ${
                                isSubActive
                                  ? 'bg-[#5A6F80] text-button-text'
                                  : 'hover:bg-[#E8EDF5]'
                              }`}
                              style={{ color: isSubActive ? '#FFFDF6' : '#0D141C' }}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {isSubActive && subItem.iconSolid ? (
                                <subItem.iconSolid
                                  className="mr-3 flex-shrink-0 h-5 w-5 text-button-text"
                                  aria-hidden="true"
                                />
                              ) : (
                                <subItem.icon
                                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                    isSubActive ? 'text-button-text' : 'text-text group-hover:text-title'
                                  }`}
                                  aria-hidden="true"
                                />
                              )}
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

          {/* User Info and Logout Section */}
          <div className="flex-shrink-0 flex flex-col border-t border-stroke p-4">
            {/* Logout Button */}
            <button 
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm font-metropolis font-regular hover:bg-[#E8EDF5] rounded-lg transition-colors"
              style={{ color: '#0D141C' }}
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
