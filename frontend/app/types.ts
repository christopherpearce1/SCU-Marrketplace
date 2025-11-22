// Types for API integration - easy to swap localStorage with API calls later

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address?: string
  livesOnCampus: boolean
  createdAt: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  images: string[]
  sellerId: string
  sellerName: string
  sellerEmail: string
  sellerPhone: string
  distance?: string
  createdAt: string
  isSold?: boolean
  tags?: string[]
}

export interface ContactInfo {
  name: string
  email: string
  phone: string
  isSCUStudent: boolean
}

