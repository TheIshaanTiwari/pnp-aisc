import { TransportMode } from './enums'

export interface Resource {
  id: string
  name: string
  description?: string
  unit?: string
  category: string
  createdAt: string
}

export interface SupplierResource {
  id: string
  supplierId: string
  resourceId: string
  unitPrice: number
  minOrderQuantity: number
  maxCapacity: number // Maximum amount supplier can provide per month
  leadTime: number // Days
  qualityRating: number // 0-1
  reliabilityRating: number // 0-1
  sustainabilityRating: number // 0-1 - Environmental impact score
}

export interface Supplier {
  id: string
  name: string
  city: string
  reliabilityRating: number
  qualityRating: number
  resources: string[] // Array of resourceIds this supplier can provide
}

export interface Warehouse {
  id: string
  name: string
  city: string
  address: string
  capacity: number
  utilizationRate: number
  operatingCosts: number
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  reorderPoint: number
  unitPrice: number
  supplierId: string
  warehouseId: string
  supplyRisk: number
  businessImpact: number
  resourceId: string // Link to the resource this inventory item represents
}

export interface Route {
  id: string
  name: string
  origin: string
  originType: 'SUPPLIER' | 'WAREHOUSE'
  destination: string
  destinationType: 'WAREHOUSE'
  distance: number
  transportMode: TransportMode
  transitTime: number
  cost: number
  reliability: number
} 