'use client'

import { useEffect, useState } from 'react'
import { listingsAPI, authAPI } from '../../api'

interface Listing {
  id: number
  title: string
  description: string
  price: string
  created_at: string
  sold: boolean
  author: string
  //category: string

}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await authAPI.getCurrentUser()
      setCurrentUser(user.username)
      loadListings()
    } catch (err) {
      // Not logged in
      setCurrentUser(null)
      setLoading(false)
    }
  }

  const loadListings = async () => {
    try {
      const allListings = await listingsAPI.getAll()
      // Filter to only show current user's listings
      const userListings = allListings.filter((l: Listing) => 
        localStorage.getItem('currentUser') === String(l.author)
      )
      setListings(userListings)
    } catch (err) {
      console.error('Failed to load listings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await listingsAPI.create(title, description, parseFloat(price))
      await loadListings() // Reload listings
      setTitle('')
      setDescription('')
      setPrice('')
      setShowForm(false)
    } catch (err: any) {
      alert(err.message || 'Failed to create listing')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    
    try {
      await listingsAPI.delete(id)
      await loadListings() // Reload listings
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing')
    }
  }

  if (!currentUser) {
    return <div>Please log in to view your listings.</div>
  }

  return (
    <div>
      <h1>My Listings</h1>
      
      <button onClick={() => setShowForm(!showForm)} style={{ padding: '5px 15px', marginBottom: '20px' }}>
        {showForm ? 'Cancel' : 'Create New Listing'}
      </button>

      {showForm && (
        <div style={{ border: '1px solid black', padding: '15px', marginBottom: '20px' }}>
          <h2>Create Listing</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label><br />
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '400px', padding: '5px' }}
                required
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Description:</label><br />
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '400px', height: '80px', padding: '5px' }}
                required
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Price ($):</label><br />
              <input 
                type="number" 
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '200px', padding: '5px' }}
                required
              />
            </div>
            {/* <div style={{ marginTop: '10px' }}>
              <label>Category:</label><br />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '200px', padding: '5px' }}
              >
                <option>Textbooks</option>
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Clothing</option>
                <option>Other</option>
              </select>
            </div> */}
            <button type="submit" style={{ marginTop: '15px', padding: '5px 15px' }}>Post Listing</button>
          </form>
        </div>
      )}

      <div>
        {loading ? (
          <p>Loading your listings...</p>
        ) : listings.length === 0 ? (
          <p>You have no listings yet.</p>
        ) : (
          listings.map(listing => (
            <div key={listing.id} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p><strong>Price:</strong> ${listing.price}</p>
              <p><strong>Created:</strong> {new Date(listing.created_at).toLocaleDateString()}</p>
              {listing.sold && <p><strong>SOLD</strong></p>}
              <button onClick={() => handleDelete(listing.id)} style={{ padding: '5px 10px' }}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}