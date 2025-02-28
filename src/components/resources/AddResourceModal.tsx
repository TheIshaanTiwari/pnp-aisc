'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addResource } from '@/lib/store/slices/resourceSlice'
import { addSupplierResourceAndUpdateSupplier } from '@/lib/store/slices/supplierResourceSlice'
import { RootState } from '@/types/store'
import { Supplier } from '@/types/models'

interface AddResourceModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SupplierWithLeadTime {
  id: string
  leadTime: number
}

export default function AddResourceModal({ isOpen, onClose }: AddResourceModalProps) {
  const [isClient, setIsClient] = useState(false)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
  })
  const [selectedSuppliers, setSelectedSuppliers] = useState<SupplierWithLeadTime[]>([])

  // Get all suppliers from the store
  const suppliers = useSelector((state: RootState) => state.suppliers?.suppliers || [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Add the resource and get the result
    const action = dispatch(addResource(formData))
    const newResource = action.payload

    // Then create supplier resources for each selected supplier
    for (const { id: supplierId, leadTime } of selectedSuppliers) {
      await dispatch(addSupplierResourceAndUpdateSupplier({
        supplierId,
        resourceId: newResource.id,
        leadTime,
        unitPrice: 0,
        minOrderQuantity: 0,
        maxCapacity: 0,
        qualityRating: 0,
        reliabilityRating: 0,
        sustainabilityRating: 0
      }))
    }

    // Reset form and close modal
    onClose()
    setFormData({ name: '', category: '' })
    setSelectedSuppliers([])
  }

  const toggleSupplier = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.find(s => s.id === supplierId)
        ? prev.filter(s => s.id !== supplierId)
        : [...prev, { id: supplierId, leadTime: 0 }]
    )
  }

  const updateLeadTime = (supplierId: string, leadTime: number) => {
    setSelectedSuppliers(prev =>
      prev.map(s => s.id === supplierId ? { ...s, leadTime } : s)
    )
  }

  if (!isClient || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Add New Resource
              </h3>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Suppliers and Set Lead Times
                  </label>
                  <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-300 dark:border-gray-600">
                    {suppliers.map((supplier) => (
                      <div
                        key={supplier.id}
                        className="flex items-center space-x-3 border-b border-gray-200 px-4 py-2 last:border-b-0 dark:border-gray-700"
                      >
                        <input
                          type="checkbox"
                          id={`supplier-${supplier.id}`}
                          checked={selectedSuppliers.some(s => s.id === supplier.id)}
                          onChange={() => toggleSupplier(supplier.id)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`supplier-${supplier.id}`}
                          className="block flex-1 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {supplier.name}
                        </label>
                        {selectedSuppliers.some(s => s.id === supplier.id) && (
                          <div className="flex items-center space-x-2">
                            <label
                              htmlFor={`leadTime-${supplier.id}`}
                              className="text-sm text-gray-500 dark:text-gray-400"
                            >
                              Lead Time (days):
                            </label>
                            <input
                              type="number"
                              id={`leadTime-${supplier.id}`}
                              value={selectedSuppliers.find(s => s.id === supplier.id)?.leadTime || 0}
                              onChange={(e) => updateLeadTime(supplier.id, parseInt(e.target.value))}
                              className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                              min="0"
                              required
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Resource
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
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
  )
} 