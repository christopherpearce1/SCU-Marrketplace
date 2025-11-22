"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Package } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/listings", label: "Listings", icon: Package },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '256px',
      borderRight: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>SCU Marketplace</h1>
        </div>
        <nav style={{ flex: 1, padding: '16px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive ? '#ffffff' : '#374151',
                      backgroundColor: isActive ? '#3b82f6' : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px' }} />
                    <span style={{ fontWeight: '500' }}>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
