interface City {
  name: string
  coordinates: [number, number] // [latitude, longitude]
  country: string
}

export const cities: City[] = [
  // North America
  { name: "New York", coordinates: [40.7128, -74.0060], country: "USA" },
  { name: "Los Angeles", coordinates: [34.0522, -118.2437], country: "USA" },
  { name: "Chicago", coordinates: [41.8781, -87.6298], country: "USA" },
  { name: "Houston", coordinates: [29.7604, -95.3698], country: "USA" },
  { name: "Toronto", coordinates: [43.6532, -79.3832], country: "Canada" },
  { name: "Vancouver", coordinates: [49.2827, -123.1207], country: "Canada" },
  { name: "Mexico City", coordinates: [19.4326, -99.1332], country: "Mexico" },

  // Europe
  { name: "London", coordinates: [51.5074, -0.1278], country: "UK" },
  { name: "Paris", coordinates: [48.8566, 2.3522], country: "France" },
  { name: "Berlin", coordinates: [52.5200, 13.4050], country: "Germany" },
  { name: "Madrid", coordinates: [40.4168, -3.7038], country: "Spain" },
  { name: "Rome", coordinates: [41.9028, 12.4964], country: "Italy" },
  { name: "Amsterdam", coordinates: [52.3676, 4.9041], country: "Netherlands" },

  // Asia
  { name: "Tokyo", coordinates: [35.6762, 139.6503], country: "Japan" },
  { name: "Shanghai", coordinates: [31.2304, 121.4737], country: "China" },
  { name: "Hong Kong", coordinates: [22.3193, 114.1694], country: "China" },
  { name: "Singapore", coordinates: [1.3521, 103.8198], country: "Singapore" },
  { name: "Dubai", coordinates: [25.2048, 55.2708], country: "UAE" },
  { name: "Mumbai", coordinates: [19.0760, 72.8777], country: "India" },

  // Australia & Oceania
  { name: "Sydney", coordinates: [-33.8688, 151.2093], country: "Australia" },
  { name: "Melbourne", coordinates: [-37.8136, 144.9631], country: "Australia" },
  { name: "Auckland", coordinates: [-36.8509, 174.7645], country: "New Zealand" }
]

export const getCityCoordinates = (cityName: string): [number, number] | undefined => {
  const city = cities.find(c => c.name === cityName)
  return city?.coordinates
}

export const formatCityString = (cityName: string): string | undefined => {
  const coords = getCityCoordinates(cityName);
  if (!coords) return undefined;
  return `${coords[0]},${coords[1]}`;
}

export const parseCityString = (cityString: string): string | undefined => {
  const [lat, lng] = cityString.split(',').map(Number)
  const city = cities.find(c => 
    Math.abs(c.coordinates[0] - lat) < 0.01 && 
    Math.abs(c.coordinates[1] - lng) < 0.01
  )
  return city?.name
}

// Group cities by country for better dropdown organization
export const citiesByCountry = cities.reduce((acc, city) => {
  if (!acc[city.country]) {
    acc[city.country] = []
  }
  acc[city.country].push(city.name)
  return acc
}, {} as Record<string, string[]>) 