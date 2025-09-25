import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar?: string | null
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          type: string
          price: number
          expiry_time: string
          seller_id: string
          seller_name: string
          image_url: string | null
          location: string
          available_quantity: number
          sold_quantity: number
          status: string
          views: number
          inquiries: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          type: string
          price: number
          expiry_time: string
          seller_id: string
          seller_name: string
          image_url?: string | null
          location: string
          available_quantity: number
          sold_quantity?: number
          status?: string
          views?: number
          inquiries?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          type?: string
          price?: number
          expiry_time?: string
          seller_id?: string
          seller_name?: string
          image_url?: string | null
          location?: string
          available_quantity?: number
          sold_quantity?: number
          status?: string
          views?: number
          inquiries?: number
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          ticket_id: string
          buyer_id: string
          quantity: number
          total_amount: number
          purchase_date: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          buyer_id: string
          quantity: number
          total_amount: number
          purchase_date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          buyer_id?: string
          quantity?: number
          total_amount?: number
          purchase_date?: string
          status?: string
          updated_at?: string
        }
      }
    }
  }
}