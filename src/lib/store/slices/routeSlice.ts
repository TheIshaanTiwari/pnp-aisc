import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Route } from '@/types/store'
import { TransportMode } from '@/types/enums'
import { dataService } from '@/lib/services/dataService'

export enum CostClass {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

interface RouteState {
  routes: Route[]
  selectedRoute: string | null
  filteredTransportModes: TransportMode[]
  loading: boolean
  error: string | null
}

const initialState: RouteState = {
  routes: typeof window !== 'undefined' ? dataService.getRoutes() : [],
  selectedRoute: null,
  filteredTransportModes: [],
  loading: false,
  error: null,
}

const routeSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    setRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('routes', JSON.stringify(action.payload))
      }
    },
    addRoute: (state, action: PayloadAction<Route>) => {
      state.routes.push(action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('routes', JSON.stringify(state.routes))
      }
    },
    updateRoute: (state, action: PayloadAction<Route>) => {
      const index = state.routes.findIndex(r => r.id === action.payload.id)
      if (index !== -1) {
        state.routes[index] = action.payload
        if (typeof window !== 'undefined') {
          localStorage.setItem('routes', JSON.stringify(state.routes))
        }
      }
    },
    removeRoute: (state, action: PayloadAction<string>) => {
      state.routes = state.routes.filter(r => r.id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('routes', JSON.stringify(state.routes))
      }
    },
    selectRoute: (state, action: PayloadAction<string | null>) => {
      state.selectedRoute = action.payload
    },
    setFilteredTransportModes: (state, action: PayloadAction<TransportMode[]>) => {
      state.filteredTransportModes = action.payload
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
  setRoutes,
  addRoute,
  updateRoute,
  removeRoute,
  selectRoute,
  setFilteredTransportModes,
  setLoading,
  setError,
} = routeSlice.actions

export default routeSlice.reducer 