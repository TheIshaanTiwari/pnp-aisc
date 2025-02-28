'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { addRoute } from '@/lib/store/slices/routeSlice'
import { RootState } from '@/types/store'
import { TransportMode } from '@/types/enums'

interface AddRouteModalProps {
  isOpen: boolean
  onClose: () => void
}

type LocationType = 'SUPPLIER' | 'WAREHOUSE'

interface LocationOption {
  id: string
  name: string
  type: LocationType
}

export default function AddRouteModal({ isOpen, onClose }: AddRouteModalProps) {
  const dispatch = useDispatch()
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers)
  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses)

  const [formData, setFormData] = useState({
    name: '',
    originType: 'WAREHOUSE' as LocationType,
    origin: '',
    destinationType: 'WAREHOUSE' as LocationType,
    destination: '',
    transportMode: TransportMode.TRUCK,
    transitTime: 0,
    cost: 0,
    reliability: 0.95,
  })

  // Combine suppliers and warehouses for origin selection
  const originOptions: LocationOption[] = [
    ...suppliers.map(s => ({ id: s.id, name: s.name, type: 'SUPPLIER' as LocationType })),
    ...warehouses.map(w => ({ id: w.id, name: w.name, type: 'WAREHOUSE' as LocationType }))
  ]

  // Only warehouses can be destinations
  const destinationOptions: LocationOption[] = [
    ...warehouses.map(w => ({ id: w.id, name: w.name, type: 'WAREHOUSE' as LocationType }))
  ]

  // Auto-generate route name when selections change
  const generateRouteName = (origin: string, destination: string, mode: TransportMode) => {
    const originName = originOptions.find(opt => opt.id === origin)?.name || ''
    const destName = destinationOptions.find(opt => opt.id === destination)?.name || ''
    if (originName && destName && mode) {
      return `${originName} to ${destName} via ${mode}`
    }
    return ''
  }

  // Update form data and auto-generate name when selections change
  const updateFormWithName = (updates: Partial<typeof formData>) => {
    const newData = { ...formData, ...updates }
    const newName = generateRouteName(newData.origin, newData.destination, newData.transportMode)
    setFormData({ ...newData, name: newName })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(addRoute({
      id: Date.now().toString(),
      name: formData.name,
      origin: formData.origin,
      originType: formData.originType,
      destination: formData.destination,
      destinationType: formData.destinationType,
      transportMode: formData.transportMode,
      transitTime: formData.transitTime,
      cost: formData.cost,
      reliability: formData.reliability,
    }))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-800"></div>
        </div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none dark:hover:text-gray-300"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Add New Route</h3>
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Origin
                    </label>
                    <select
                      id="origin"
                      value={formData.origin}
                      onChange={(e) => {
                        const selected = originOptions.find(opt => opt.id === e.target.value)
                        updateFormWithName({
                          origin: e.target.value,
                          originType: selected?.type || 'WAREHOUSE'
                        })
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                    >
                      <option value="">Select origin</option>
                      <optgroup label="Suppliers">
                        {originOptions
                          .filter(opt => opt.type === 'SUPPLIER')
                          .map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))
                        }
                      </optgroup>
                      <optgroup label="Warehouses">
                        {originOptions
                          .filter(opt => opt.type === 'WAREHOUSE')
                          .map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))
                        }
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Destination Warehouse
                    </label>
                    <select
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => updateFormWithName({ destination: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                    >
                      <option value="">Select destination warehouse</option>
                      {destinationOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="transportMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transport Mode
                    </label>
                    <select
                      id="transportMode"
                      value={formData.transportMode}
                      onChange={(e) => updateFormWithName({ transportMode: e.target.value as TransportMode })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                    >
                      {Object.values(TransportMode).map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Route Name (Auto-generated)
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 sm:text-sm"
                      readOnly
                    />
                  </div>

                  <div>
                    <label htmlFor="transitTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transit Time (hours)
                    </label>
                    <input
                      type="number"
                      id="transitTime"
                      value={formData.transitTime}
                      onChange={(e) => setFormData({ ...formData, transitTime: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cost ($)
                    </label>
                    <input
                      type="number"
                      id="cost"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label htmlFor="reliability" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reliability (0-1)
                    </label>
                    <input
                      type="number"
                      id="reliability"
                      value={formData.reliability}
                      onChange={(e) => setFormData({ ...formData, reliability: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                      min="0"
                      max="1"
                      step="0.01"
                    />
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Add Route
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 