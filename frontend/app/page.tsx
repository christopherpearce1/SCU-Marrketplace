'use client'

import { useEffect, useState } from 'react'
import { listingsAPI } from '../api'

interface Listing {
  id: number
  title: string
  description: string
  price: string
  created_at: string
  sold: boolean
  author: number | null
  category: string
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadListings()
  }, [])

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

  return (
    <div>
      <h1>All Listings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        listings.map(listing => (
          <div key={listing.id} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p><strong>Price:</strong> ${listing.price}</p>
            <p><strong>Created:</strong> {new Date(listing.created_at).toLocaleDateString()}</p>
            {listing.sold && <p><strong>SOLD</strong></p>}
          </div>
        ))
      )}
    </div>
  )
}
