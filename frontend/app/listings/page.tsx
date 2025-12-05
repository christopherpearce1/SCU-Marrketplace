'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listingsAPI, authAPI } from '../../api'

interface Listing {
  id: number
  title: string
  description: string
  price: number
  category?: string
  author: { username: string }
}

export default function ListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Textbooks')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authAPI.getCurrentUser()
        if (user && user.username) {
          setCurrentUser(user.username)
          await loadListings(user.username)
        } else {
          router.push('/login')
        }
      } catch (err) {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  const loadListings = async (username: string | null) => {
    if (!username) {
      setLoading(false)
      return
    }
    try {
      const allListings = await listingsAPI.getAll()
      const userListings = allListings.filter((l: Listing) => l.author?.username === username)
      setListings(userListings)
    } catch (err) {
      console.error('Failed to load listings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        // Update existing listing
        await listingsAPI.update(editingId, title, description, parseFloat(price), category, imagePreview || undefined)
      } else {
        // Create new listing
        await listingsAPI.create(title, description, parseFloat(price), category, imagePreview || undefined)
      }
      
      setTitle('')
      setDescription('')
      setPrice('')
      setCategory('Textbooks')
      setImage(null)
      setImagePreview(null)
      setShowForm(false)
      setEditingId(null)
      if (currentUser) await loadListings(currentUser)
    } catch (err: any) {
      alert(err.message || 'Failed to save listing')
    }
  }

  const handleEdit = (listing: Listing) => {
    setEditingId(listing.id)
    setTitle(listing.title)
    setDescription(listing.description)
    setPrice(listing.price.toString())
    setCategory(listing.category || 'Textbooks')
    setImagePreview(null)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setPrice('')
    setCategory('Textbooks')
    setImage(null)
    setImagePreview(null)
    setShowForm(false)
  }

  const handleDelete = async (id: number) => {
    try {
      await listingsAPI.delete(id)
      // Use functional setState to avoid stale closure (pass function instead of value to avoid stale closure)
      setListings(prevListings => prevListings.filter(l => l.id !== id))
    } catch (err: any) {
      // handle error by removing from UI
      setListings(prevListings => prevListings.filter(l => l.id !== id))
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>My Listings</h1>
      
      <button onClick={() => setShowForm(!showForm)} style={{ padding: '5px 15px', marginBottom: '20px' }}>
        {showForm ? 'Cancel' : 'Create New Listing'}
      </button>

      {showForm && (
        <div style={{ border: '1px solid black', padding: '15px', marginBottom: '20px' }}>
          <h2>{editingId ? 'Edit Listing' : 'Create Listing'}</h2>
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
            <div style={{ marginTop: '10px' }}>
              <label>Image:</label><br />
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ padding: '5px' }}
              />
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '6px' }} />
                </div>
              )}
            </div>
            <button type="submit" style={{ marginTop: '15px', padding: '5px 15px' }}>
              {editingId ? 'Update Listing' : 'Post Listing'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} style={{ marginTop: '15px', marginLeft: '10px', padding: '5px 15px' }}>
                Cancel
              </button>
            )}
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
              <button onClick={() => handleEdit(listing)} style={{ padding: '5px 10px', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(listing.id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}