'use client'

import { Providers } from '@/lib/store/provider'
import { useInitializeData } from '@/lib/hooks/useInitializeData'
import Sidebar from '@/components/layout/Sidebar'
import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { useEffect } from 'react'

// Separate component for data initialization
function DataInitializer({ children }: { children: React.ReactNode }) {
  useInitializeData()
  return <>{children}</>
}

// Layout wrapper that includes navigation components
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)
  const darkMode = useSelector((state: RootState) => state.ui.darkMode)

  useEffect(() => {
    // Update the HTML class when dark mode changes
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
        }`}
      >
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <DataInitializer>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </DataInitializer>
    </Providers>
  )
} 