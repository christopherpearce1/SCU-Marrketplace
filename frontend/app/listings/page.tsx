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

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Textbooks')
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    setCurrentUser(user)
    loadListings(user)
  }, [])

  const loadListings = (user: string | null) => {
    if (!user) return
    const allListings = JSON.parse(localStorage.getItem('listings') || '[]')
    const userListings = allListings.filter((l: Listing) => l.seller === user)
    setListings(userListings)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newListing: Listing = {
      id: Date.now().toString(),
      title,
      description,
      price: parseFloat(price),
      category,
      seller: currentUser!,
      createdAt: new Date().toISOString()
    }

    const allListings = JSON.parse(localStorage.getItem('listings') || '[]')
    allListings.push(newListing)
    localStorage.setItem('listings', JSON.stringify(allListings))
    
    setListings([...listings, newListing])
    setTitle('')
    setDescription('')
    setPrice('')
    setCategory('Textbooks')
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const allListings = JSON.parse(localStorage.getItem('listings') || '[]')
    const updated = allListings.filter((l: Listing) => l.id !== id)
    localStorage.setItem('listings', JSON.stringify(updated))
    setListings(listings.filter(l => l.id !== id))
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
            <div style={{ marginTop: '10px' }}>
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
            </div>
            <button type="submit" style={{ marginTop: '15px', padding: '5px 15px' }}>Post Listing</button>
          </form>
        </div>
      )}

      <div>
        {listings.length === 0 ? (
          <p>You have no listings yet.</p>
        ) : (
          listings.map(listing => (
            <div key={listing.id} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p><strong>Price:</strong> ${listing.price}</p>
              <p><strong>Category:</strong> {listing.category}</p>
              <button onClick={() => handleDelete(listing.id)} style={{ padding: '5px 10px' }}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
