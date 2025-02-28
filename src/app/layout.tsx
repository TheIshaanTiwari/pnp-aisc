import './globals.css'
import { Inter } from 'next/font/google'
import { ClientLayout } from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Supply Chain Manager',
  description: 'Visualize and analyze your supply chain network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
