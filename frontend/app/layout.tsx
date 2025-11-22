import './globals.css'
import { AppSidebar } from "./components/app-sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: '100vh' }}>
          <AppSidebar />
          <main style={{ flex: 1, overflow: 'auto', padding: '20px' }}>{children}</main>
        </div>
      </body>
    </html>
  )
}
