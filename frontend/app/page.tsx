'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listingsAPI, authAPI } from '../api'

interface Listing {
  id: number
  title: string
  description: string
  price: number
  category?: string
  author: { username: string; first_name: string; last_name: string }
  image?: string
}

export default function HomePage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [search, setSearch] = useState('')
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authAPI.getCurrentUser()
        await loadListings()
      } catch (err) {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  const loadListings = async () => {
    try {
      const data = await listingsAPI.getAll()
      setListings(data)
    } catch (err) {
      console.error('Failed to load listings:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = listings.filter(l => 
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.description.toLowerCase().includes(search.toLowerCase()) ||
    `${l.author.first_name} ${l.author.last_name}`.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>All Listings</h1>
      
      <input
        type="text"
        placeholder="Search listings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ddd',
          borderRadius: '6px'
        }}
      />

      <div>
        {filtered.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          filtered.map(listing => (
            <div key={listing.id} style={{ border: '1px solid gray', padding: '15px', marginBottom: '15px', borderRadius: '8px', display: 'flex', gap: '15px' }}>
              {listing.image && (
                <img src={listing.image} alt={listing.title} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{listing.title}</h3>
                <p style={{ margin: '0 0 8px 0' }}>{listing.description}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Price:</strong> ${listing.price}</p>
                {listing.category && <p style={{ margin: '0 0 8px 0' }}><strong>Category:</strong> {listing.category}</p>}
                <p style={{ margin: '0 0 12px 0' }}><strong>Seller:</strong> {listing.author?.first_name || ''} {listing.author?.last_name || ''}</p>
                <button onClick={() => setSelectedListing(listing)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                  Contact Seller
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedListing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedListing(null)}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px 0' }}>Contact Seller</h2>
            <p><strong>Item:</strong> {selectedListing.title}</p>
            <p><strong>Seller:</strong> {selectedListing.author?.first_name || ''} {selectedListing.author?.last_name || ''}</p>
            <p><strong>Email:</strong> {selectedListing.author?.username || ''}</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '16px' }}>Send an email to the seller to arrange pickup or ask questions.</p>
            <button onClick={() => setSelectedListing(null)} style={{ marginTop: '16px', padding: '8px 16px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
