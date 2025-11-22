'use client'

import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const profiles = JSON.parse(localStorage.getItem('profiles') || '{}')
      const userProfile = profiles[currentUser]
      setProfile(userProfile)
      setName(userProfile?.name || '')
    }
  }, [])

  const handleSave = () => {
    if (!profile) return
    
    const profiles = JSON.parse(localStorage.getItem('profiles') || '{}')
    profiles[profile.email] = { ...profile, name }
    localStorage.setItem('profiles', JSON.stringify(profiles))
    setProfile({ ...profile, name })
    setIsEditing(false)
  }

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Profile</h1>
      
      <div style={{ border: '1px solid black', padding: '15px', maxWidth: '500px' }}>
        <div style={{ marginBottom: '15px' }}>
          <strong>Name:</strong><br />
          {isEditing ? (
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '300px', padding: '5px', marginTop: '5px' }}
            />
          ) : (
            <span>{profile.name}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Email:</strong><br />
          <span>{profile.email}</span>
        </div>

        {isEditing ? (
          <>
            <button onClick={handleSave} style={{ padding: '5px 15px', marginRight: '10px' }}>Save</button>
            <button onClick={() => setIsEditing(false)} style={{ padding: '5px 15px' }}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} style={{ padding: '5px 15px' }}>Edit Profile</button>
        )}
      </div>
    </div>
  )
}