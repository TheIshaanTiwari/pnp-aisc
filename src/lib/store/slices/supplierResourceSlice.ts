import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SupplierResource } from '@/types/models'
import { dataService } from '@/lib/services/dataService'
import { updateSupplier } from './supplierSlice'
import { AppDispatch } from '../store'

interface SupplierResourceState {
  supplierResources: SupplierResource[]
  loading: boolean
}

const initialState: SupplierResourceState = {
  supplierResources: [],
  loading: false
}

const supplierResourceSlice = createSlice({
  name: 'supplierResource',
  initialState,
  reducers: {
    addSupplierResource: (state, action: PayloadAction<Omit<SupplierResource, 'id'>>) => {
      const newSupplierResource = dataService.addSupplierResource(action.payload)
      state.supplierResources.push(newSupplierResource)
    },
  }
})

export const addSupplierResourceAndUpdateSupplier = (supplierResourceData: Omit<SupplierResource, 'id'>) => {
  return async (dispatch: AppDispatch) => {
    // First add the supplier resource
    const action = dispatch(addSupplierResource(supplierResourceData))
    const newSupplierResource = action.payload

    // Then get the supplier and update its resources array
    const supplier = dataService.getSuppliers().find(s => s.id === supplierResourceData.supplierId)
    if (supplier) {
      const updatedSupplier = {
        ...supplier,
        resources: [...supplier.resources, supplierResourceData.resourceId]
      }
      dispatch(updateSupplier(updatedSupplier))
    }
  }
}

export const { addSupplierResource } = supplierResourceSlice.actions
export default supplierResourceSlice.reducer 