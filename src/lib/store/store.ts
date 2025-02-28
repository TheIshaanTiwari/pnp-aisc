import { configureStore } from '@reduxjs/toolkit'
import resourceReducer from './slices/resourceSlice'
import supplierReducer from './slices/supplierSlice'
import warehouseReducer from './slices/warehouseSlice'
import inventoryReducer from './slices/inventorySlice'
import routeReducer from './slices/routeSlice'
import supplierResourceReducer from './slices/supplierResourceSlice'
import uiReducer from './slices/uiSlice'
import { dataService } from '@/lib/services/dataService'

// Initialize the store with data from localStorage
const preloadedState = {
  resources: {
    resources: [],
    selectedResource: null,
    loading: false,
    error: null,
  },
}

export const store = configureStore({
  reducer: {
    resources: resourceReducer,
    suppliers: supplierReducer,
    warehouses: warehouseReducer,
    inventory: inventoryReducer,
    routes: routeReducer,
    supplierResources: supplierResourceReducer,
    ui: uiReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: true,
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Log initial state
console.log('Initial Redux State:', store.getState())

export type AppDispatch = typeof store.dispatch 