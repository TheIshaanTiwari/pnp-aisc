import dynamic from 'next/dynamic'

// Dynamically import the map component with no SSR
const DynamicSupplyChainMap = dynamic(
  () => import('./SupplyChainMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
      </div>
    )
  }
)

export default DynamicSupplyChainMap 