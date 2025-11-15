'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.endsWith('@scu.edu')) {
      setError('Must use @scu.edu email')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}')
    
    if (users[email] && users[email] === password) {
      localStorage.setItem('currentUser', email)
      router.push('/')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label><br />
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Password:</label><br />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: '10px', padding: '5px 15px' }}>Login</button>
      </form>
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  )
}
