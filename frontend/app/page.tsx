'use client'

import { useEffect, useState } from 'react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  seller: string
  createdAt: string
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    const storedListings = localStorage.getItem('listings')
    if (storedListings) {
      setListings(JSON.parse(storedListings))
    }
  }, [])

  return (
    <div>
      <h1>All Listings</h1>
      <div>
        {listings.length === 0 ? (
          <p>No listings yet.</p>
        ) : (
          listings.map(listing => (
            <div key={listing.id} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p><strong>Price:</strong> ${listing.price}</p>
              <p><strong>Category:</strong> {listing.category}</p>
              <p><strong>Seller:</strong> {listing.seller}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
