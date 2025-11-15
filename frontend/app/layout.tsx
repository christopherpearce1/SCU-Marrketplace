'use client'

import './globals.css'
import { AppSidebar } from "./components/app-sidebar"
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: '100vh', overflow: 'hidden' }}>
        {isAuthPage ? (
          children
        ) : (
          <div style={{ display: 'flex', height: '100vh' }}>
            <AppSidebar />
            <main style={{ flex: 1, overflow: 'auto', padding: '20px' }}>{children}</main>
          </div>
        )}
      </body>
    </html>
  )
}
