'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import {
  BuildingOfficeIcon,
  TruckIcon,
  CubeIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline'

export default function DashboardStats() {
  const [isClient, setIsClient] = useState(false)
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers)
  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses)
  const routes = useSelector((state: RootState) => state.routes.routes)
  const resources = useSelector((state: RootState) => state.resources.resources)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const stats = [
    {
      name: 'Total Suppliers',
      value: isClient ? suppliers.length : 0,
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Active Warehouses',
      value: isClient ? warehouses.length : 0,
      icon: CubeIcon,
    },
    {
      name: 'Transportation Routes',
      value: isClient ? routes.length : 0,
      icon: TruckIcon,
    },
    {
      name: 'Total Resources',
      value: isClient ? resources.length : 0,
      icon: CircleStackIcon,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </dd>
        </div>
      ))}
    </div>
  )
} 