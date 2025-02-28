'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import DashboardStats from '@/components/dashboard/DashboardStats'
import SupplyChainMap from '@/components/map/SupplyChainMap'

export default function Home() {
  const loading = useSelector((state: RootState) => 
    state.resources.loading || 
    state.suppliers.loading || 
    state.warehouses.loading || 
    state.routes.loading
  )

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Supply Chain Overview
      </h1>

      <DashboardStats />

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Supply Chain Network
        </h2>
        <div className="h-[calc(100vh-24rem)]">
          <SupplyChainMap />
        </div>
      </div>
    </div>
  )
}
