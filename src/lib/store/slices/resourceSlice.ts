import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Resource } from '@/types/models'
import { dataService } from '@/lib/services/dataService'

interface ResourceState {
  resources: Resource[]
  selectedResource: Resource | null
  loading: boolean
  error: string | null
}

const initialState: ResourceState = {
  resources: [],
  selectedResource: null,
  loading: false,
  error: null,
}

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResources: (state, action: PayloadAction<Resource[]>) => {
      console.log('Setting resources:', action.payload)
      state.resources = action.payload
    },
    addResource: {
      prepare: (resource: Omit<Resource, 'id' | 'createdAt'>) => {
        const savedResource = dataService.addResource(resource)
        return { payload: savedResource }
      },
      reducer: (state, action: PayloadAction<Resource>) => {
        console.log('Adding resource:', action.payload)
        state.resources = [...state.resources, action.payload]
        console.log('Updated resources:', state.resources)
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('resources', JSON.stringify(state.resources))
        }
      }
    },
    updateResource: (state, action: PayloadAction<Resource>) => {
      const index = state.resources.findIndex(r => r.id === action.payload.id)
      if (index !== -1) {
        state.resources = [
          ...state.resources.slice(0, index),
          action.payload,
          ...state.resources.slice(index + 1)
        ]
        if (typeof window !== 'undefined') {
          localStorage.setItem('resources', JSON.stringify(state.resources))
        }
      }
    },
    removeResource: (state, action: PayloadAction<string>) => {
      state.resources = state.resources.filter(r => r.id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('resources', JSON.stringify(state.resources))
      }
    },
    selectResource: (state, action: PayloadAction<Resource | null>) => {
      state.selectedResource = action.payload
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
  setResources,
  addResource,
  updateResource,
  removeResource,
  selectResource,
  setLoading,
  setError,
} = resourceSlice.actions

export default resourceSlice.reducer 