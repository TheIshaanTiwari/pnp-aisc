import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Supplier } from '@/types/store'
import { dataService } from '@/lib/services/dataService'

interface SupplierState {
  suppliers: Supplier[]
  selectedSupplier: string | null
  loading: boolean
  error: string | null
}

const initialState: SupplierState = {
  suppliers: typeof window !== 'undefined' ? dataService.getSuppliers() : [],
  selectedSupplier: null,
  loading: false,
  error: null,
}

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
      state.suppliers = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('suppliers', JSON.stringify(action.payload))
      }
    },
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.suppliers.push(action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('suppliers', JSON.stringify(state.suppliers))
      }
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      const index = state.suppliers.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.suppliers[index] = action.payload
        if (typeof window !== 'undefined') {
          localStorage.setItem('suppliers', JSON.stringify(state.suppliers))
        }
      }
    },
    removeSupplier: (state, action: PayloadAction<string>) => {
      state.suppliers = state.suppliers.filter(s => s.id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('suppliers', JSON.stringify(state.suppliers))
      }
    },
    selectSupplier: (state, action: PayloadAction<string | null>) => {
      state.selectedSupplier = action.payload
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
  setSuppliers,
  addSupplier,
  updateSupplier,
  removeSupplier,
  selectSupplier,
  setLoading,
  setError,
} = supplierSlice.actions

export default supplierSlice.reducer 