'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setResources } from '@/lib/store/slices/resourceSlice'
import { setSuppliers } from '@/lib/store/slices/supplierSlice'
import { setWarehouses } from '@/lib/store/slices/warehouseSlice'
import { setRoutes } from '@/lib/store/slices/routeSlice'
import { setInventory } from '@/lib/store/slices/inventorySlice'
import { dataService } from '@/lib/services/dataService'

export default function DataInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize localStorage with dummy data if needed
    dataService.init()

    // Load data into Redux store
    dispatch(setResources(dataService.getResources()))
    dispatch(setSuppliers(dataService.getSuppliers()))
    dispatch(setWarehouses(dataService.getWarehouses()))
    dispatch(setRoutes(dataService.getRoutes()))
    dispatch(setInventory(dataService.getInventory()))
  }, [dispatch])

  return null
} 