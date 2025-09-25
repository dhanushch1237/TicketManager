export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  created_at: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  category: TicketCategory
  type: TicketType
  price: number
  expiry_time: string
  seller_id: string
  seller_name: string
  image_url?: string
  location: string
  available_quantity: number
  sold_quantity: number
  status: string
  views: number
  inquiries: number
  created_at: string
  updated_at: string
}

export type TicketCategory = 'cricket' | 'entertainment' | 'concert' | 'sports' | 'theater' | 'comedy'
export type TicketType = 'general' | 'vip' | 'premium' | 'standard'

export interface Purchase {
  id: string
  ticket_id: string
  buyer_id: string
  quantity: number
  total_amount: number
  purchase_date: string
  status: 'pending' | 'confirmed' | 'cancelled'
}