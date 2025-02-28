'use client'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import mapboxgl from 'mapbox-gl'
import { RootState } from '@/types/store'
import { Route, Supplier, Warehouse } from '@/types/models'
import { TransportMode } from '@/types/enums'
import { cities } from '@/lib/utils/cities'

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapLocation {
  id: string
  name: string
  type: 'SUPPLIER' | 'WAREHOUSE'
  lat: number
  lng: number
}

// Define colors for different transport modes
const TRANSPORT_MODE_COLORS = {
  [TransportMode.TRUCK]: '#10B981', // Green
  [TransportMode.SHIP]: '#3B82F6',  // Blue
  [TransportMode.PLANE]: '#EF4444', // Red
  [TransportMode.RAIL]: '#F59E0B'   // Yellow
}

// Define line offset for parallel routes
const LINE_OFFSET = 0.1 // degrees

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses)
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers)
  const routes = useSelector((state: RootState) => state.routes.routes)

  // Transform data into map format
  const locations: MapLocation[] = [
    ...warehouses.map((w: Warehouse) => {
      // Find the city in our cities database
      const cityName = w.city.split(',').map(Number).join(',')
      const cityData = cities.find(c => 
        Math.abs(c.coordinates[0] - Number(w.city.split(',')[0])) < 0.01 && 
        Math.abs(c.coordinates[1] - Number(w.city.split(',')[1])) < 0.01
      )
      
      if (!cityData) {
        console.warn(`City data not found for warehouse ${w.name} at ${w.city}`)
        return null
      }

      // Note: cityData.coordinates is [lat, lng], but we store them separately for clarity
      return {
        id: w.id,
        name: w.name,
        type: 'WAREHOUSE' as const,
        lat: cityData.coordinates[0],
        lng: cityData.coordinates[1]
      }
    }).filter(Boolean) as MapLocation[],
    ...suppliers.map((s: Supplier) => {
      // Find the city in our cities database
      const cityName = s.city.split(',').map(Number).join(',')
      const cityData = cities.find(c => 
        Math.abs(c.coordinates[0] - Number(s.city.split(',')[0])) < 0.01 && 
        Math.abs(c.coordinates[1] - Number(s.city.split(',')[1])) < 0.01
      )
      
      if (!cityData) {
        console.warn(`City data not found for supplier ${s.name} at ${s.city}`)
        return null
      }

      return {
        id: s.id,
        name: s.name,
        type: 'SUPPLIER' as const,
        lat: cityData.coordinates[0],
        lng: cityData.coordinates[1]
      }
    }).filter(Boolean) as MapLocation[]
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isClient || !mapContainer.current || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return

    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98, 39], // Center of USA
      zoom: 3
    })

    map.current.addControl(new mapboxgl.NavigationControl())

    // Wait for map style to load
    map.current.on('style.load', () => {
      setMapLoaded(true)
    })

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      
      // Remove map
      map.current?.remove()
    }
  }, [isClient])

  // Update markers and routes
  useEffect(() => {
    if (!isClient || !map.current || !mapLoaded || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return

    // Clean up existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add markers for all locations
    locations.forEach(location => {
      if (!location || isNaN(location.lat) || isNaN(location.lng)) {
        console.warn('Invalid location data:', location)
        return
      }

      const el = document.createElement('div')
      el.className = location.type === 'WAREHOUSE' ? 'warehouse-marker' : 'supplier-marker'
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = location.type === 'WAREHOUSE' ? '#4F46E5' : '#10B981'

      // Note: Mapbox expects coordinates in [longitude, latitude] order
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${location.name}</h3>
            <p class="text-sm text-gray-500">${location.type}</p>
          </div>
        `))
        .addTo(map.current!)

      markersRef.current.push(marker)
    })

    // Group routes by origin-destination pair
    const routeGroups = routes.reduce((groups, route) => {
      const key = `${route.origin}-${route.destination}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(route)
      return groups
    }, {} as Record<string, Route[]>)

    // Remove existing route layers and sources
    Object.keys(routeGroups).forEach((key, groupIndex) => {
      const sourceId = `route-source-${key}`
      const layerId = `route-layer-${key}`
      
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId)
      }
      if (map.current?.getSource(sourceId)) {
        map.current.removeSource(sourceId)
      }
    })

    // Add new route layers
    Object.entries(routeGroups).forEach(([key, groupRoutes], groupIndex) => {
      const sourceId = `route-source-${key}`
      const origin = locations.find(l => l.id === groupRoutes[0].origin)
      const destination = locations.find(l => l.id === groupRoutes[0].destination)

      if (!origin || !destination) {
        console.warn(`Could not find locations for route ${key}`)
        return
      }

      if (isNaN(origin.lng) || isNaN(origin.lat) || isNaN(destination.lng) || isNaN(destination.lat)) {
        console.warn(`Invalid coordinates for route ${key}:`, { origin, destination })
        return
      }

      groupRoutes.forEach((route, routeIndex) => {
        const layerId = `route-layer-${key}-${route.transportMode}`
        const offset = (routeIndex - (groupRoutes.length - 1) / 2) * LINE_OFFSET

        // Create curved line coordinates with validation
        const midLng = (origin.lng + destination.lng) / 2
        const midLat = (origin.lat + destination.lat) / 2 + offset

        if (isNaN(midLng) || isNaN(midLat)) {
          console.warn(`Invalid midpoint for route ${key}:`, { midLng, midLat })
          return
        }

        const midPoint = [midLng, midLat] as [number, number]

        try {
          map.current?.addSource(`${sourceId}-${route.transportMode}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [origin.lng, origin.lat],
                  midPoint,
                  [destination.lng, destination.lat]
                ]
              },
              properties: {}
            }
          })

          map.current?.addLayer({
            id: layerId,
            type: 'line',
            source: `${sourceId}-${route.transportMode}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': TRANSPORT_MODE_COLORS[route.transportMode],
              'line-width': 3,
              'line-opacity': 0.8
            }
          })

          // Add hover effect
          map.current?.on('mouseenter', layerId, () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer'
              new mapboxgl.Popup()
                .setLngLat(midPoint)
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-semibold">${route.name}</h3>
                    <p class="text-sm text-gray-600">From: ${origin.name}</p>
                    <p class="text-sm text-gray-600">To: ${destination.name}</p>
                    <p class="mt-2">Mode: ${route.transportMode}</p>
                    <p>Transit Time: ${route.transitTime} days</p>
                    <p>Cost: $${route.cost.toFixed(2)}</p>
                  </div>
                `)
                .addTo(map.current)
            }
          })

          map.current?.on('mouseleave', layerId, () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = ''
            }
          })
        } catch (error) {
          console.error(`Error adding route ${key}:`, error)
        }
      })
    })

    // Add legend
    const legend = document.createElement('div')
    legend.className = 'absolute bottom-4 right-4 bg-white p-4 rounded shadow-lg dark:bg-gray-800'
    legend.innerHTML = `
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Locations</h4>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-4 rounded-full" style="background-color: #F97316"></div>
            <span class="text-sm text-gray-700 dark:text-gray-300">WAREHOUSE</span>
          </div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-4 rounded-full" style="background-color: #22C55E"></div>
            <span class="text-sm text-gray-700 dark:text-gray-300">SUPPLIER</span>
          </div>
        </div>
        <div>
          <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Transport Modes</h4>
          ${Object.entries(TRANSPORT_MODE_COLORS)
            .map(([mode, color]) => `
              <div class="flex items-center gap-2 mb-1">
                <div class="w-4 h-4 rounded" style="background-color: ${color}"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">${mode}</span>
              </div>
            `).join('')}
        </div>
      </div>
    `
    
    mapContainer.current?.appendChild(legend)

    return () => {
      legend.remove()
    }
  }, [warehouses, suppliers, routes, isClient, mapLoaded])

  if (!isClient || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div className="text-center">
          {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
            <p className="text-gray-500 dark:text-gray-400">
              Please add your Mapbox token to .env.local
            </p>
          ) : (
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapContainer} 
      className="h-full w-full rounded-lg shadow relative"
    />
  )
}

// Create a wrapper component that handles both CSS and map
const SupplyChainMap = () => {
  useEffect(() => {
    // Import CSS only when component mounts
    import('mapbox-gl/dist/mapbox-gl.css').catch(console.error)
  }, [])

  return <MapComponent />
}

export default SupplyChainMap 