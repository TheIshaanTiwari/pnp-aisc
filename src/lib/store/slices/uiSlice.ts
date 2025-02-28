import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface UIState {
  darkMode: boolean
  sidebarOpen: boolean
  activeTab: string
  mapView: {
    center: [number, number]
    zoom: number
  }
  notifications: {
    id: string
    type: NotificationType
    message: string
  }[]
}

const initialState: UIState = {
  darkMode: false,
  sidebarOpen: true,
  activeTab: 'dashboard',
  mapView: {
    center: [0, 0],
    zoom: 2,
  },
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
    setMapView: (state, action: PayloadAction<{ center: [number, number]; zoom: number }>) => {
      state.mapView = action.payload
    },
    addNotification: (state, action: PayloadAction<{ type: NotificationType; message: string }>) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  toggleDarkMode,
  toggleSidebar,
  setActiveTab,
  setMapView,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions

export default uiSlice.reducer 