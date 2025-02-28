import { Supplier, Warehouse, Route, InventoryItem, Resource, SupplierResource } from '@/types/models'
import { TransportMode } from '@/types/enums'

// Helper function to initialize localStorage with empty arrays
const initializeStorage = () => {
  if (typeof window === 'undefined') return

  if (!localStorage.getItem('resources')) {
    localStorage.setItem('resources', JSON.stringify([]))
  }
  if (!localStorage.getItem('supplierResources')) {
    localStorage.setItem('supplierResources', JSON.stringify([]))
  }
  if (!localStorage.getItem('suppliers')) {
    localStorage.setItem('suppliers', JSON.stringify([]))
  }
  if (!localStorage.getItem('warehouses')) {
    localStorage.setItem('warehouses', JSON.stringify([]))
  }
  if (!localStorage.getItem('inventory')) {
    localStorage.setItem('inventory', JSON.stringify([]))
  }
  if (!localStorage.getItem('routes')) {
    localStorage.setItem('routes', JSON.stringify([]))
  }
}

// Data service functions
export const dataService = {
  // Initialize data
  init: () => {
    console.log('Initializing data service')
    initializeStorage()
  },

  // Resources
  getResources: (): Resource[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('resources')
    const resources = data ? JSON.parse(data) : []
    console.log('Retrieved resources from localStorage:', resources)
    return resources
  },

  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => {
    console.log('Adding new resource:', resource)
    const resources = dataService.getResources()
    const newResource = {
      ...resource,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const updatedResources = [...resources, newResource]
    console.log('Saving updated resources:', updatedResources)
    localStorage.setItem('resources', JSON.stringify(updatedResources))
    return newResource
  },

  // Supplier Resources
  getSupplierResources: (): SupplierResource[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('supplierResources')
    return data ? JSON.parse(data) : []
  },

  addSupplierResource: (supplierResource: Omit<SupplierResource, 'id'>) => {
    const supplierResources = dataService.getSupplierResources()
    const newSupplierResource = {
      ...supplierResource,
      id: Date.now().toString()
    }
    localStorage.setItem('supplierResources', JSON.stringify([...supplierResources, newSupplierResource]))
    return newSupplierResource
  },

  // Get resources for a specific supplier
  getSupplierResourcesById: (supplierId: string): SupplierResource[] => {
    const supplierResources = dataService.getSupplierResources()
    return supplierResources.filter(sr => sr.supplierId === supplierId)
  },

  // Get suppliers for a specific resource
  getSuppliersForResource: (resourceId: string): string[] => {
    const supplierResources = dataService.getSupplierResources()
    return [...new Set(supplierResources
      .filter(sr => sr.resourceId === resourceId)
      .map(sr => sr.supplierId))]
  },

  // Suppliers
  getSuppliers: (): Supplier[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('suppliers')
    return data ? JSON.parse(data) : []
  },

  addSupplier: (supplier: Omit<Supplier, 'id'>) => {
    const suppliers = dataService.getSuppliers()
    const newSupplier = {
      ...supplier,
      id: Date.now().toString(),
    }
    localStorage.setItem('suppliers', JSON.stringify([...suppliers, newSupplier]))
    return newSupplier
  },

  // Warehouses
  getWarehouses: (): Warehouse[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('warehouses')
    return data ? JSON.parse(data) : []
  },

  addWarehouse: (warehouse: Omit<Warehouse, 'id'>) => {
    const warehouses = dataService.getWarehouses()
    const newWarehouse = {
      ...warehouse,
      id: Date.now().toString(),
    }
    localStorage.setItem('warehouses', JSON.stringify([...warehouses, newWarehouse]))
    return newWarehouse
  },

  // Inventory
  getInventory: (): InventoryItem[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('inventory')
    return data ? JSON.parse(data) : []
  },

  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => {
    const inventory = dataService.getInventory()
    const newItem = {
      ...item,
      id: Date.now().toString(),
    }
    localStorage.setItem('inventory', JSON.stringify([...inventory, newItem]))
    return newItem
  },

  // Routes
  getRoutes: (): Route[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('routes')
    return data ? JSON.parse(data) : []
  },

  addRoute: (route: Omit<Route, 'id'>) => {
    const routes = dataService.getRoutes()
    const newRoute = {
      ...route,
      id: Date.now().toString(),
    }
    localStorage.setItem('routes', JSON.stringify([...routes, newRoute]))
    return newRoute
  },
} 