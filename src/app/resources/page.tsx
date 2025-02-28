'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { useState, useEffect } from 'react'
import { Resource } from '@/types/models'
import AddResourceModal from '@/components/resources/AddResourceModal'

export default function ResourcesPage() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get the resources slice state
  const resourcesState = useSelector((state: RootState) => state.resources)

  // Derive values from the resources slice
  const resources = resourcesState?.resources || []
  const loading = resourcesState?.loading ?? true
  const error = resourcesState?.error || null

  const suppliers = useSelector((state: RootState) => {
    if (!state.suppliers) return []
    return state.suppliers.suppliers
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  if (!isClient || loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-red-500">
          Error loading resources: {error}
        </div>
      </div>
    )
  }

  if (!resources.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Resources</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Resource
          </button>
        </div>
        <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
          No resources found. Click "Add Resource" to create one.
        </div>
        <AddResourceModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Resources</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Resource
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource: Resource) => {
          const supplierCount = suppliers.filter(s => s.resources?.includes(resource.id)).length

          return (
            <div
              key={resource.id}
              className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md dark:bg-gray-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {resource.name}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {supplierCount} suppliers
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Category: {resource.category}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Unit: {resource.unit}
                  </p>
                  {resource.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {resource.description}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Suppliers</h4>
                  <ul className="mt-2 space-y-1">
                    {suppliers
                      .filter(s => s.resources?.includes(resource.id))
                      .map(supplier => (
                        <li
                          key={supplier.id}
                          className="text-sm text-gray-500 dark:text-gray-400"
                        >
                          {supplier.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <AddResourceModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
} 