import './globals.css'
import Navigation from './components/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Arial', margin: '20px' }}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
