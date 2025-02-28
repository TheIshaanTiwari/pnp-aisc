'use client'

import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { RootState } from '@/types/store'
import { Supplier, Warehouse, Route } from '@/types/models'

const SupplierNode = ({ data }: any) => (
  <div className="rounded-lg border border-emerald-500 bg-emerald-50 p-3 shadow-sm dark:border-emerald-400 dark:bg-emerald-900/30">
    <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{data.label}</div>
  </div>
)

const WarehouseNode = ({ data }: any) => (
  <div className="rounded-lg border border-indigo-500 bg-indigo-50 p-3 shadow-sm dark:border-indigo-400 dark:bg-indigo-900/30">
    <div className="text-sm font-medium text-indigo-900 dark:text-indigo-100">{data.label}</div>
  </div>
)

const nodeTypes = {
  supplier: SupplierNode,
  warehouse: WarehouseNode,
}

export default function SupplyChainGraph() {
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers)
  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses)
  const routes = useSelector((state: RootState) => state.routes.routes)
  const darkMode = useSelector((state: RootState) => state.ui.darkMode)

  // Create nodes from suppliers and warehouses
  const initialNodes: Node[] = [
    ...suppliers.map((supplier: Supplier, index: number) => ({
      id: supplier.id,
      type: 'supplier',
      position: { x: 100, y: index * 100 + 50 },
      data: { label: supplier.name },
    })),
    ...warehouses.map((warehouse: Warehouse, index: number) => ({
      id: warehouse.id,
      type: 'warehouse',
      position: { x: 400, y: index * 100 + 50 },
      data: { label: warehouse.name },
    })),
  ]

  // Create edges from routes
  const initialEdges: Edge[] = routes.map((route: Route) => ({
    id: route.id,
    source: route.origin,
    target: route.destination,
    animated: true,
    label: route.transportMode,
    labelStyle: { fill: darkMode ? '#e5e7eb' : '#374151', fontWeight: 500 },
    style: { stroke: darkMode ? '#4b5563' : '#94a3b8' },
  }))

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onInit = useCallback(() => {
    console.log('Graph initialized')
  }, [])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className={darkMode ? 'dark-flow' : ''}
      >
        <Controls className={darkMode ? 'dark-controls' : ''} />
        <MiniMap className={darkMode ? 'dark-minimap' : ''} />
        <Background color={darkMode ? '#374151' : '#94a3b8'} gap={16} />
      </ReactFlow>
    </div>
  )
} 