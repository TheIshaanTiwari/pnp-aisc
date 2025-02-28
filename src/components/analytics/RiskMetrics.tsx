'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { useState, useEffect } from 'react'
import {
  ExclamationTriangleIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { Warehouse, Route, InventoryItem } from '@/types/models'
import { useInitializeData } from '@/lib/hooks/useInitializeData'

interface RiskMetric {
  name: string
  value: number
  description: string
  icon: any
  severity: 'low' | 'medium' | 'high'
}

export default function RiskMetrics() {
  const [isClient, setIsClient] = useState(false)
  useInitializeData()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses)
  const routes = useSelector((state: RootState) => state.routes.routes)
  const inventory = useSelector((state: RootState) => state.inventory.items)

  // Calculate geographic concentration
  const calculateGeographicConcentration = () => {
    if (warehouses.length < 2) return 0
    
    // Simple calculation based on unique lat/lng pairs
    const uniqueLocations = new Set(
      warehouses.map((w: Warehouse) => `${w.location.lat.toFixed(2)},${w.location.lng.toFixed(2)}`)
    )
    return 1 - uniqueLocations.size / warehouses.length
  }

  // Calculate route diversity
  const calculateRouteRedundancy = () => {
    if (warehouses.length < 2) return 0

    // Count warehouses with multiple routes
    const warehouseRoutes = new Map<string, Set<string>>()
    routes.forEach((route: Route) => {
      if (!warehouseRoutes.has(route.origin)) {
        warehouseRoutes.set(route.origin, new Set())
      }
      warehouseRoutes.get(route.origin)?.add(route.destination)
    })

    const warehousesWithMultipleRoutes = Array.from(warehouseRoutes.values())
      .filter(destinations => destinations.size > 1).length

    return warehousesWithMultipleRoutes / warehouses.length
  }

  // Calculate critical item risk based on supply risk and business impact
  const calculateCriticalItemRisk = () => {
    if (inventory.length === 0) return 0

    // Consider items with high supply risk and business impact as critical
    const criticalItems = inventory.filter((item: InventoryItem) => 
      item.supplyRisk > 0.7 && item.businessImpact > 0.7
    )
    
    if (criticalItems.length === 0) return 0
    
    const avgRisk = criticalItems.reduce((acc: number, item: InventoryItem) => 
      acc + (item.supplyRisk * item.businessImpact), 0
    ) / criticalItems.length

    return avgRisk
  }

  // Calculate average transit time risk
  const calculateLeadTimeRisk = () => {
    if (routes.length === 0) return 0

    const maxTransitTime = Math.max(...routes.map(route => route.transitTime))
    const avgTransitTime = routes.reduce((acc, route) => acc + route.transitTime, 0) / routes.length

    return avgTransitTime / maxTransitTime
  }

  if (!isClient) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
      </div>
    )
  }

  const metrics: RiskMetric[] = [
    {
      name: 'Geographic Concentration',
      value: calculateGeographicConcentration(),
      description: 'Risk of regional disruptions affecting multiple facilities',
      icon: MapPinIcon,
      severity: calculateGeographicConcentration() > 0.7 ? 'high' : calculateGeographicConcentration() > 0.4 ? 'medium' : 'low',
    },
    {
      name: 'Route Redundancy',
      value: calculateRouteRedundancy(),
      description: 'Availability of alternative transportation routes',
      icon: TruckIcon,
      severity: calculateRouteRedundancy() < 0.3 ? 'high' : calculateRouteRedundancy() < 0.6 ? 'medium' : 'low',
    },
    {
      name: 'Critical Item Risk',
      value: calculateCriticalItemRisk(),
      description: 'Supply risk for critical components',
      icon: ExclamationTriangleIcon,
      severity: calculateCriticalItemRisk() > 0.7 ? 'high' : calculateCriticalItemRisk() > 0.4 ? 'medium' : 'low',
    },
    {
      name: 'Lead Time Risk',
      value: calculateLeadTimeRisk(),
      description: 'Risk based on transit times',
      icon: ClockIcon,
      severity: calculateLeadTimeRisk() > 0.7 ? 'high' : calculateLeadTimeRisk() > 0.4 ? 'medium' : 'low',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
          <div className="flex items-center">
            <div
              className={`rounded-md p-3 ${
                metric.severity === 'high'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                  : metric.severity === 'medium'
                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
              }`}
            >
              <metric.icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {metric.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span
                    className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                      metric.severity === 'high'
                        ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : metric.severity === 'medium'
                        ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {metric.severity}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {(metric.value * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex h-2 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${metric.value * 100}%` }}
                  className={`${
                    metric.severity === 'high'
                      ? 'bg-red-500'
                      : metric.severity === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 