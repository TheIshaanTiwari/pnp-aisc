'use client'

import { useState } from 'react'
import NetworkMetrics from '@/components/analytics/NetworkMetrics'
import GeographicalRiskAnalysis from '@/components/analytics/GeographicalRiskAnalysis'
import KraljicMatrix from '@/components/analytics/KraljicMatrix'
import RiskMetrics from '@/components/analytics/RiskMetrics'
import { ChartBarIcon, MapIcon, TableCellsIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const tabs = [
  { name: 'Overview', icon: ChartBarIcon, component: RiskMetrics },
  { name: 'Geographical Risk', icon: MapIcon, component: GeographicalRiskAnalysis },
  { name: 'Network Analysis', icon: TableCellsIcon, component: NetworkMetrics },
  { name: 'Critical Items', icon: ExclamationTriangleIcon, component: KraljicMatrix }
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0)

  const ActiveComponent = tabs[activeTab].component

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Supply Chain Analytics</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              className={`
                flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
                ${activeTab === index
                  ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200'
                }
              `}
            >
              <tab.icon className={`
                mr-2 h-5 w-5
                ${activeTab === index
                  ? 'text-indigo-500 dark:text-indigo-400'
                  : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                }
              `}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        <ActiveComponent />
      </div>
    </div>
  )
} 