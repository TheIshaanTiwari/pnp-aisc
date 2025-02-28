'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { useMemo, useEffect } from 'react'
import { Resource, Route, Supplier, Warehouse } from '@/types/models'
import { useInitializeData } from '@/lib/hooks/useInitializeData'

interface Node {
  id: string
  type: 'SUPPLIER' | 'WAREHOUSE'
  name: string
  resources?: string[]
}

interface Edge {
  source: string
  target: string
  weight: number // Based on reliability and cost
}

interface NetworkMetrics {
  degree: { [key: string]: number }
  betweenness: { [key: string]: number }
  closeness: { [key: string]: number }
  eigenvector: { [key: string]: number }
}

export default function NetworkMetrics() {
  // Initialize data
  useInitializeData()

  const routes = useSelector((state: RootState) => state.routes?.routes ?? [])
  const suppliers = useSelector((state: RootState) => state.suppliers?.suppliers ?? [])
  const warehouses = useSelector((state: RootState) => state.warehouses?.warehouses ?? [])
  const resources = useSelector((state: RootState) => state.resources?.resources ?? [])

  // Check if data is loaded
  const isLoading = routes.length === 0 || suppliers.length === 0 || warehouses.length === 0 || resources.length === 0

  // Create network graph
  const { nodes, edges } = useMemo(() => {
    if (isLoading) {
      return { nodes: [], edges: [] }
    }

    const nodes: Node[] = [
      ...suppliers.map(s => ({ 
        id: s.id, 
        type: 'SUPPLIER' as const, 
        name: s.name, 
        resources: s.resources || [] 
      })),
      ...warehouses.map(w => ({ 
        id: w.id, 
        type: 'WAREHOUSE' as const, 
        name: w.name 
      }))
    ]

    const edges: Edge[] = routes.map(route => ({
      source: route.origin,
      target: route.destination,
      weight: route.reliability * (1 / (route.cost / 1000)) // Normalize cost to 0-1 range
    }))

    return { nodes, edges }
  }, [suppliers, warehouses, routes, isLoading])

  // Calculate network metrics
  const metrics = useMemo(() => {
    const result: NetworkMetrics = {
      degree: {},
      betweenness: {},
      closeness: {},
      eigenvector: {}
    }

    // Calculate degree centrality (number of direct connections)
    nodes.forEach(node => {
      result.degree[node.id] = edges.filter(
        e => e.source === node.id || e.target === node.id
      ).length
    })

    // Calculate betweenness centrality (number of shortest paths going through node)
    // This is a simplified version - in reality, you'd use a proper graph library
    nodes.forEach(node => {
      let pathCount = 0
      nodes.forEach(source => {
        if (source.id === node.id) return
        nodes.forEach(target => {
          if (target.id === node.id || target.id === source.id) return
          const directPath = edges.some(
            e => 
              (e.source === source.id && e.target === target.id) ||
              (e.source === target.id && e.target === source.id)
          )
          const indirectPath = edges.some(
            e => 
              (e.source === source.id && e.target === node.id) ||
              (e.source === node.id && e.target === source.id)
          ) && edges.some(
            e => 
              (e.source === node.id && e.target === target.id) ||
              (e.source === target.id && e.target === node.id)
          )
          if (!directPath && indirectPath) pathCount++
        })
      })
      result.betweenness[node.id] = pathCount
    })

    // Calculate closeness centrality (inverse of average shortest path length)
    nodes.forEach(node => {
      let totalDistance = 0
      let reachableNodes = 0
      nodes.forEach(target => {
        if (target.id === node.id) return
        const directPath = edges.find(
          e => 
            (e.source === node.id && e.target === target.id) ||
            (e.source === target.id && e.target === node.id)
        )
        if (directPath) {
          totalDistance += 1 / directPath.weight
          reachableNodes++
        }
      })
      result.closeness[node.id] = reachableNodes ? reachableNodes / totalDistance : 0
    })

    // Calculate eigenvector centrality (importance based on connections to important nodes)
    // This is a simplified version using power iteration
    const maxIterations = 100
    const tolerance = 0.0001
    let eigenVector: { [key: string]: number } = {}
    nodes.forEach(node => {
      eigenVector[node.id] = 1 / nodes.length
    })

    for (let iter = 0; iter < maxIterations; iter++) {
      const newEigenVector: { [key: string]: number } = {}
      let norm = 0

      nodes.forEach(node => {
        newEigenVector[node.id] = 0
        edges.forEach(edge => {
          if (edge.source === node.id) {
            newEigenVector[node.id] += eigenVector[edge.target] * edge.weight
          }
          if (edge.target === node.id) {
            newEigenVector[node.id] += eigenVector[edge.source] * edge.weight
          }
        })
        norm += newEigenVector[node.id] * newEigenVector[node.id]
      })

      norm = Math.sqrt(norm)
      let diff = 0
      nodes.forEach(node => {
        newEigenVector[node.id] /= norm
        diff += Math.abs(newEigenVector[node.id] - eigenVector[node.id])
      })

      eigenVector = newEigenVector
      if (diff < tolerance) break
    }

    result.eigenvector = eigenVector

    return result
  }, [nodes, edges])

  // Group nodes by resource for resource-specific analysis
  const resourceNetworks = useMemo(() => {
    const networks: { [key: string]: Node[] } = {}
    
    resources.forEach((resource: Resource) => {
      const resourceNodes = nodes.filter(node => 
        node.type === 'SUPPLIER' && node.resources?.includes(resource.id)
      )
      const connectedWarehouses = new Set<string>()
      
      edges.forEach(edge => {
        const supplier = resourceNodes.find(n => n.id === edge.source)
        if (supplier) {
          connectedWarehouses.add(edge.target)
        }
      })
      
      networks[resource.id] = [
        ...resourceNodes,
        ...nodes.filter(node => 
          node.type === 'WAREHOUSE' && connectedWarehouses.has(node.id)
        )
      ]
    })
    
    return networks
  }, [nodes, edges, resources])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Network Analysis</h2>
        
        {/* Overall Network Metrics */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Connected Node</h3>
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {Object.entries(metrics.degree).sort((a, b) => b[1] - a[1])[0]?.[0]}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {nodes.find(n => n.id === Object.entries(metrics.degree).sort((a, b) => b[1] - a[1])[0]?.[0])?.name}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical Bottleneck</h3>
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {Object.entries(metrics.betweenness).sort((a, b) => b[1] - a[1])[0]?.[0]}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {nodes.find(n => n.id === Object.entries(metrics.betweenness).sort((a, b) => b[1] - a[1])[0]?.[0])?.name}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Accessible Node</h3>
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {Object.entries(metrics.closeness).sort((a, b) => b[1] - a[1])[0]?.[0]}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {nodes.find(n => n.id === Object.entries(metrics.closeness).sort((a, b) => b[1] - a[1])[0]?.[0])?.name}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Influential Node</h3>
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {Object.entries(metrics.eigenvector).sort((a, b) => b[1] - a[1])[0]?.[0]}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {nodes.find(n => n.id === Object.entries(metrics.eigenvector).sort((a, b) => b[1] - a[1])[0]?.[0])?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Resource-specific Networks */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resource Networks</h3>
          <div className="mt-4 space-y-6">
            {resources.map((resource: Resource) => (
              <div key={resource.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">{resource.name}</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Suppliers: {resourceNetworks[resource.id]?.filter(n => n.type === 'SUPPLIER').length || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Connected Warehouses: {resourceNetworks[resource.id]?.filter(n => n.type === 'WAREHOUSE').length || 0}
                  </p>
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Participants:</h5>
                    <ul className="mt-1 list-inside list-disc text-sm text-gray-500 dark:text-gray-400">
                      {resourceNetworks[resource.id]?.map(node => (
                        <li key={node.id}>
                          {node.name} ({node.type})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 