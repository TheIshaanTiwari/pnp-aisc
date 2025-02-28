'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import NotificationList from '../ui/NotificationList'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode)
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-64' : ''}`}>
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
          <NotificationList />
        </div>
      </div>
    </div>
  )
} 