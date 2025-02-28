'use client'

import NetworkMetrics from '@/components/analytics/NetworkMetrics'

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Supply Chain Analytics</h1>
      <NetworkMetrics />
    </div>
  )
} 