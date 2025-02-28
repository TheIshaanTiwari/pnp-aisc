'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { useMemo } from 'react'
import { ExclamationTriangleIcon, FireIcon, CloudIcon } from '@heroicons/react/24/outline'
import { Warehouse, Supplier, Route } from '@/types/models'

interface GeoRisk {
  id: string
  name: string
  type: 'SUPPLIER' | 'WAREHOUSE'
  location: string
  riskScore: number
  riskFactors: string[]
  alternativeRoutes: number
  criticalityScore: number
}

interface RiskZone {
  name: string
  nodes: GeoRisk[]
  totalRiskScore: number
  description: string
}

export default function GeographicalRiskAnalysis() {
  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses)
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers)
  const routes = useSelector((state: RootState) => state.routes.routes)

  // Calculate geographical risks for each node
  const nodeRisks = useMemo(() => {
    const risks: GeoRisk[] = []
    
    // Helper function to count alternative routes
    const countAlternativeRoutes = (nodeId: string, type: 'source' | 'target') => {
      const connections = new Set<string>()
      routes.forEach(route => {
        if (type === 'source' && route.origin === nodeId) {
          connections.add(route.destination)
        } else if (type === 'target' && route.destination === nodeId) {
          connections.add(route.origin)
        }
      })
      return connections.size
    }

    // Analyze suppliers
    suppliers.forEach(supplier => {
      const alternativeRoutes = countAlternativeRoutes(supplier.id, 'source')
      const [lat, lng] = supplier.city.split(',').map(Number)
      
      // Example risk factors based on location
      const riskFactors = []
      if (Math.abs(lat) > 45) riskFactors.push('Extreme Weather Risk')
      if (alternativeRoutes < 2) riskFactors.push('Limited Route Options')
      
      risks.push({
        id: supplier.id,
        name: supplier.name,
        type: 'SUPPLIER',
        location: supplier.city,
        riskScore: calculateLocationRiskScore(lat, lng, alternativeRoutes),
        riskFactors,
        alternativeRoutes,
        criticalityScore: calculateCriticalityScore(supplier.id, routes)
      })
    })

    // Analyze warehouses
    warehouses.forEach(warehouse => {
      const alternativeRoutes = countAlternativeRoutes(warehouse.id, 'target')
      const [lat, lng] = warehouse.city.split(',').map(Number)
      
      const riskFactors = []
      if (Math.abs(lat) > 45) riskFactors.push('Extreme Weather Risk')
      if (alternativeRoutes < 2) riskFactors.push('Limited Route Options')
      if (isCoastalLocation(lat, lng)) riskFactors.push('Coastal Flooding Risk')
      
      risks.push({
        id: warehouse.id,
        name: warehouse.name,
        type: 'WAREHOUSE',
        location: warehouse.city,
        riskScore: calculateLocationRiskScore(lat, lng, alternativeRoutes),
        riskFactors,
        alternativeRoutes,
        criticalityScore: calculateCriticalityScore(warehouse.id, routes)
      })
    })

    return risks
  }, [warehouses, suppliers, routes])

  // Group nodes into risk zones
  const riskZones = useMemo(() => {
    const zones: RiskZone[] = []
    
    // Group by geographical proximity
    const processedNodes = new Set<string>()
    
    nodeRisks.forEach(node => {
      if (processedNodes.has(node.id)) return
      
      const [nodeLat, nodeLng] = node.location.split(',').map(Number)
      const zoneNodes = nodeRisks.filter(other => {
        if (processedNodes.has(other.id)) return false
        
        const [otherLat, otherLng] = other.location.split(',').map(Number)
        return calculateDistance(nodeLat, nodeLng, otherLat, otherLng) < 500 // 500km radius
      })
      
      if (zoneNodes.length > 0) {
        zoneNodes.forEach(n => processedNodes.add(n.id))
        
        zones.push({
          name: `${node.name} Region`,
          nodes: zoneNodes,
          totalRiskScore: zoneNodes.reduce((sum, n) => sum + n.riskScore, 0) / zoneNodes.length,
          description: generateZoneDescription(zoneNodes)
        })
      }
    })
    
    return zones.sort((a, b) => b.totalRiskScore - a.totalRiskScore)
  }, [nodeRisks])

  return (
    <div className="space-y-6">
      {/* High-Risk Nodes */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
          <ExclamationTriangleIcon className="mr-2 h-6 w-6 text-red-500" />
          High-Risk Nodes
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nodeRisks
            .filter(node => node.riskScore > 0.7)
            .map(node => (
              <div
                key={node.id}
                className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900"
              >
                <h3 className="text-lg font-medium text-red-900 dark:text-red-200">
                  {node.name} ({node.type})
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  Risk Score: {(node.riskScore * 100).toFixed(1)}%
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-red-600 dark:text-red-400">
                  {node.riskFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>

      {/* Risk Zones */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
          <CloudIcon className="mr-2 h-6 w-6 text-blue-500" />
          Geographical Risk Zones
        </h2>
        <div className="mt-4 space-y-4">
          {riskZones.map((zone, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {zone.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Risk Score: {(zone.totalRiskScore * 100).toFixed(1)}%
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {zone.description}
              </p>
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Affected Nodes:
                </h4>
                <ul className="mt-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {zone.nodes.map(node => (
                    <li
                      key={node.id}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      • {node.name} ({node.type})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Single Points of Failure */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
          <FireIcon className="mr-2 h-6 w-6 text-orange-500" />
          Single Points of Failure
        </h2>
        <div className="mt-4 space-y-4">
          {nodeRisks
            .filter(node => node.alternativeRoutes < 2 && node.criticalityScore > 0.7)
            .map(node => (
              <div
                key={node.id}
                className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900"
              >
                <h3 className="text-lg font-medium text-orange-900 dark:text-orange-200">
                  {node.name} ({node.type})
                </h3>
                <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                  Criticality Score: {(node.criticalityScore * 100).toFixed(1)}%
                </p>
                <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                  Alternative Routes: {node.alternativeRoutes}
                </p>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Recommended Actions:
                  </h4>
                  <ul className="mt-1 list-inside list-disc text-sm text-orange-700 dark:text-orange-300">
                    <li>Establish backup suppliers/routes</li>
                    <li>Increase safety stock</li>
                    <li>Develop contingency plans</li>
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function calculateLocationRiskScore(lat: number, lng: number, alternativeRoutes: number): number {
  let score = 0
  
  // Weather risk based on latitude
  score += Math.abs(lat) > 45 ? 0.3 : 0
  
  // Coastal risk
  if (isCoastalLocation(lat, lng)) score += 0.2
  
  // Route diversity risk
  score += Math.max(0, 0.5 - (alternativeRoutes * 0.1))
  
  return Math.min(1, score)
}

function calculateCriticalityScore(nodeId: string, routes: Route[]): number {
  const connectedRoutes = routes.filter(r => r.origin === nodeId || r.destination === nodeId)
  const avgReliability = connectedRoutes.reduce((sum, r) => sum + r.reliability, 0) / connectedRoutes.length
  
  return 1 - (avgReliability || 0)
}

function isCoastalLocation(lat: number, lng: number): boolean {
  // Simplified coastal check - would need a proper geographical database
  const coastalPoints = [
    // US Coasts (rough approximations)
    { lat: 40, lng: -74 }, // NYC
    { lat: 34, lng: -118 }, // LA
    { lat: 25, lng: -80 }, // Miami
    { lat: 47, lng: -122 }, // Seattle
  ]
  
  return coastalPoints.some(point => 
    calculateDistance(lat, lng, point.lat, point.lng) < 100 // 100km from coast
  )
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function generateZoneDescription(nodes: GeoRisk[]): string {
  const totalNodes = nodes.length
  const highRiskNodes = nodes.filter(n => n.riskScore > 0.7).length
  const riskFactors = new Set<string>()
  nodes.forEach(node => node.riskFactors.forEach(factor => riskFactors.add(factor)))
  
  return `This zone contains ${totalNodes} nodes, with ${highRiskNodes} high-risk nodes. ` +
    `Common risk factors include: ${Array.from(riskFactors).join(', ')}.`
} 