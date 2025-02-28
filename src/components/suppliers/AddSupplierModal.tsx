'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { addSupplier } from '@/lib/store/slices/supplierSlice'
import CitySelect from '@/components/common/CitySelect'
import { formatCityString } from '@/lib/utils/cities'

interface AddSupplierModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddSupplierModal({ isOpen, onClose }: AddSupplierModalProps) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    reliabilityRating: 0,
    qualityRating: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Format city string with coordinates
    const cityString = formatCityString(formData.city)
    if (!cityString) {
      alert('Please select a valid city')
      return
    }

    dispatch(addSupplier({
      id: Date.now().toString(),
      ...formData,
      city: cityString, // Use formatted city string with coordinates
      resources: [], // Initialize with empty resources array
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
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Add New Supplier</h3>
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Supplier Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                    />
                  </div>

                  <CitySelect
                    value={formData.city}
                    onChange={(cityName) => setFormData({ ...formData, city: cityName })}
                    required
                  />

                  <div>
                    <label htmlFor="reliabilityRating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reliability Rating (0-5)
                    </label>
                    <input
                      type="number"
                      id="reliabilityRating"
                      value={formData.reliabilityRating}
                      onChange={(e) => setFormData({ ...formData, reliabilityRating: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label htmlFor="qualityRating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quality Rating (0-5)
                    </label>
                    <input
                      type="number"
                      id="qualityRating"
                      value={formData.qualityRating}
                      onChange={(e) => setFormData({ ...formData, qualityRating: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                      required
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Add Supplier
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