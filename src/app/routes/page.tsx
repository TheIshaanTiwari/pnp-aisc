'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { TransportMode } from '@/types/enums'
import { Route } from '@/types/models'
import AddRouteModal from '@/components/routes/AddRouteModal'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function RoutesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const routes = useSelector((state: RootState) => state.routes.routes)
  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses)
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers)
  const loading = useSelector((state: RootState) => state.routes.loading)

  const getLocationName = (id: string, type: 'SUPPLIER' | 'WAREHOUSE') => {
    if (type === 'SUPPLIER') {
      return suppliers.find(s => s.id === id)?.name || 'Unknown Supplier'
    }
    return warehouses.find(w => w.id === id)?.name || 'Unknown Warehouse'
  }

  const getTransportModeColor = (mode: TransportMode) => {
    switch (mode) {
      case TransportMode.TRUCK:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case TransportMode.SHIP:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case TransportMode.PLANE:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case TransportMode.RAIL:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Transportation Routes</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all transportation routes between suppliers and warehouses in your supply chain network.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Route
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Origin
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Destination
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Transport Mode
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Distance (km)
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Transit Time (h)
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Cost ($)
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Reliability
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {routes.map((route: Route) => (
                    <tr key={route.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                        {route.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span>{getLocationName(route.origin, route.originType)}</span>
                          <span className="text-xs text-gray-400">({route.originType})</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {getLocationName(route.destination, route.destinationType)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTransportModeColor(route.transportMode)}`}>
                          {route.transportMode}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {route.distance.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {route.transitTime}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {route.cost.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {(route.reliability * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddRouteModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
} 