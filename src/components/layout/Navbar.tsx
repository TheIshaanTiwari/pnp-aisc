import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { toggleDarkMode, toggleSidebar } from '@/lib/store/slices/uiSlice'
import { Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const dispatch = useDispatch()
  const darkMode = useSelector((state: RootState) => state.ui.darkMode)

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <button
            className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => dispatch(toggleSidebar())}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 