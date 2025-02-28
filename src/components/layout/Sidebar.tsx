'use client'

import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RootState } from '@/types/store'
import { toggleSidebar } from '@/lib/store/slices/uiSlice'
import {
  HomeIcon,
  TruckIcon,
  BuildingOfficeIcon,
  CubeIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Resources', href: '/resources', icon: CircleStackIcon },
  { name: 'Suppliers', href: '/suppliers', icon: BuildingOfficeIcon },
  { name: 'Warehouses', href: '/warehouses', icon: CubeIcon },
  { name: 'Routes', href: '/routes', icon: TruckIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

export default function Sidebar() {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const isOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 transform bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className={`flex h-16 items-center ${isOpen ? 'justify-between px-4' : 'justify-center'}`}>
        {isOpen && (
          <div className="text-xl font-semibold text-gray-800 dark:text-white">
            Supply Chain Manager
          </div>
        )}
        <button
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          onClick={() => dispatch(toggleSidebar())}
        >
          {isOpen ? (
            <ArrowLeftIcon className="h-5 w-5" />
          ) : (
            <ArrowRightIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className={`mt-5 ${isOpen ? 'px-2' : 'px-0'}`}>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center ${
                  isOpen ? 'px-2 py-2' : 'justify-center py-2'
                } text-sm font-medium ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
                title={!isOpen ? item.name : undefined}
              >
                <item.icon
                  className={`h-6 w-6 flex-shrink-0 ${
                    isActive
                      ? 'text-gray-500 dark:text-gray-300'
                      : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                  }`}
                />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
} 