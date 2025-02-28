import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setResources, setLoading, setError } from '@/lib/store/slices/resourceSlice'
import { setSuppliers } from '@/lib/store/slices/supplierSlice'
import { setWarehouses } from '@/lib/store/slices/warehouseSlice'
import { setRoutes } from '@/lib/store/slices/routeSlice'
import { setInventory } from '@/lib/store/slices/inventorySlice'
import { dataService } from '@/lib/services/dataService'
import { RootState } from '@/types/store'

export function useInitializeData() {
  const dispatch = useDispatch()
  const isInitialized = useRef(false)
  const resourcesState = useSelector((state: RootState) => state.resources)

  useEffect(() => {
    const initializeData = async () => {
      // Prevent multiple initializations
      if (isInitialized.current || resourcesState?.resources?.length > 0) {
        return
      }

      isInitialized.current = true
      console.log('Initializing data in useInitializeData hook')
      
      try {
        dispatch(setLoading(true))
        dispatch(setError(null))

        // Initialize localStorage with dummy data if needed
        dataService.init()

        // Load data into Redux store in a single batch
        const [resources, suppliers, warehouses, routes, inventory] = await Promise.all([
          dataService.getResources(),
          dataService.getSuppliers(),
          dataService.getWarehouses(),
          dataService.getRoutes(),
          dataService.getInventory()
        ])

        console.log('Loaded resources:', resources)

        // Dispatch all actions in a single batch
        dispatch(setResources(resources))
        dispatch(setSuppliers(suppliers))
        dispatch(setWarehouses(warehouses))
        dispatch(setRoutes(routes))
        dispatch(setInventory(inventory))

        dispatch(setLoading(false))
      } catch (error) {
        console.error('Error initializing data:', error)
        dispatch(setError('Failed to load data'))
        dispatch(setLoading(false))
        isInitialized.current = false // Allow retry on error
      }
    }

    initializeData()
  }, [dispatch, resourcesState?.resources?.length])
} 