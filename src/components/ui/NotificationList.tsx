'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/types/store'
import { removeNotification } from '@/lib/store/slices/uiSlice'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useEffect } from 'react'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  message: string
}

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon,
} as const

const colors = {
  success: 'text-green-400 dark:text-green-300',
  error: 'text-red-400 dark:text-red-300',
  warning: 'text-yellow-400 dark:text-yellow-300',
  info: 'text-blue-400 dark:text-blue-300',
} as const

export default function NotificationList() {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.ui.notifications) as Notification[]

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notifications[0].id))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notifications, dispatch])

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 m-8 w-96 space-y-4">
      {notifications.map((notification) => {
        const Icon = icons[notification.type]
        return (
          <div
            key={notification.id}
            className="flex items-start rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
          >
            <div className="flex-shrink-0">
              <Icon className={`h-6 w-6 ${colors[notification.type]}`} />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => dispatch(removeNotification(notification.id))}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
} 