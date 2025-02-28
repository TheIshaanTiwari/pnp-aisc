import { Resource, Route, Supplier, Warehouse, InventoryItem } from './models'

export interface RootState {
  suppliers: {
    suppliers: Supplier[]
    selectedSupplier: Supplier | null
    loading: boolean
    error: string | null
  }
  warehouses: {
    warehouses: Warehouse[]
    selectedWarehouse: Warehouse | null
    loading: boolean
    error: string | null
  }
  routes: {
    routes: Route[]
    selectedRoute: Route | null
    loading: boolean
    error: string | null
  }
  inventory: {
    items: InventoryItem[]
    selectedItem: InventoryItem | null
    loading: boolean
    error: string | null
  }
  resources: {
    resources: Resource[]
    selectedResource: Resource | null
    loading: boolean
    error: string | null
  }
  ui: {
    darkMode: boolean
    sidebarOpen: boolean
    activeTab: string
    mapView: {
      center: [number, number]
      zoom: number
    }
    notifications: {
      id: string
      type: 'success' | 'error' | 'info' | 'warning'
      message: string
    }[]
  }
} 