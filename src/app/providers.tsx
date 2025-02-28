'use client'

import { Providers } from '@/lib/store/provider'
import DataInitializer from '@/components/DataInitializer'
import RootLayout from '@/components/layout/RootLayout'

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DataInitializer />
      <RootLayout>
        {children}
      </RootLayout>
    </Providers>
  )
} 