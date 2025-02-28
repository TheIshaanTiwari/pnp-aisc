import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InventoryItem } from '@/types/models'
import { dataService } from '@/lib/services/dataService'

interface InventoryState {
  items: InventoryItem[]
  selectedItem: InventoryItem | null
  kraljicThresholds: {
    supplyRisk: number
    businessImpact: number
  }
  loading: boolean
  error: string | null
}

const initialState: InventoryState = {
  items: typeof window !== 'undefined' ? dataService.getInventory() : [],
  selectedItem: null,
  kraljicThresholds: {
    supplyRisk: 0.5,
    businessImpact: 0.5,
  },
  loading: false,
  error: null,
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory: (state, action: PayloadAction<InventoryItem[]>) => {
      state.items = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('inventory', JSON.stringify(action.payload))
      }
    },
    addInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      state.items.push(action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('inventory', JSON.stringify(state.items))
      }
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        if (typeof window !== 'undefined') {
          localStorage.setItem('inventory', JSON.stringify(state.items))
        }
      }
    },
    removeInventoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('inventory', JSON.stringify(state.items))
      }
    },
    selectInventoryItem: (state, action: PayloadAction<InventoryItem | null>) => {
      state.selectedItem = action.payload
    },
    setKraljicThresholds: (state, action: PayloadAction<{ supplyRisk: number; businessImpact: number }>) => {
      state.kraljicThresholds = action.payload
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
  setInventory,
  addInventoryItem,
  updateInventoryItem,
  removeInventoryItem,
  selectInventoryItem,
  setKraljicThresholds,
  setLoading,
  setError,
} = inventorySlice.actions

export default inventorySlice.reducer 