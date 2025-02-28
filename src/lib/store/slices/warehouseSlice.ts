import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Warehouse } from '@/types/store'
import { dataService } from '@/lib/services/dataService'

interface WarehouseState {
  warehouses: Warehouse[]
  selectedWarehouse: string | null
  loading: boolean
  error: string | null
}

const initialState: WarehouseState = {
  warehouses: typeof window !== 'undefined' ? dataService.getWarehouses() : [],
  selectedWarehouse: null,
  loading: false,
  error: null,
}

const warehouseSlice = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {
    setWarehouses: (state, action: PayloadAction<Warehouse[]>) => {
      state.warehouses = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('warehouses', JSON.stringify(action.payload))
      }
    },
    addWarehouse: (state, action: PayloadAction<Warehouse>) => {
      state.warehouses.push(action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('warehouses', JSON.stringify(state.warehouses))
      }
    },
    updateWarehouse: (state, action: PayloadAction<Warehouse>) => {
      const index = state.warehouses.findIndex(w => w.id === action.payload.id)
      if (index !== -1) {
        state.warehouses[index] = action.payload
        if (typeof window !== 'undefined') {
          localStorage.setItem('warehouses', JSON.stringify(state.warehouses))
        }
      }
    },
    removeWarehouse: (state, action: PayloadAction<string>) => {
      state.warehouses = state.warehouses.filter(w => w.id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('warehouses', JSON.stringify(state.warehouses))
      }
    },
    selectWarehouse: (state, action: PayloadAction<string | null>) => {
      state.selectedWarehouse = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setWarehouses,
  addWarehouse,
  updateWarehouse,
  removeWarehouse,
  selectWarehouse,
  setLoading,
  setError,
} = warehouseSlice.actions

export default warehouseSlice.reducer 