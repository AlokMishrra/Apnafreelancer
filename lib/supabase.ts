import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL!
const supabaseAnonKey = (import.meta.env as any).VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          profile_image_url: string | null
          bio: string | null
          skills: string[] | null
          hourly_rate: number | null
          is_freelancer: boolean
          is_client: boolean
          is_admin: boolean
          status: string
          rating: number | null
          total_reviews: number
          location: string | null
          availability: string
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          bio?: string | null
          skills?: string[] | null
          hourly_rate?: number | null
          is_freelancer?: boolean
          is_client?: boolean
          is_admin?: boolean
          status?: string
          rating?: number | null
          total_reviews?: number
          location?: string | null
          availability?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          bio?: string | null
          skills?: string[] | null
          hourly_rate?: number | null
          is_freelancer?: boolean
          is_client?: boolean
          is_admin?: boolean
          status?: string
          rating?: number | null
          total_reviews?: number
          location?: string | null
          availability?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: number
          freelancer_id: string
          category_id: number
          title: string
          description: string
          price: number
          delivery_time: number
          images: string[] | null
          skills: string[] | null
          status: string
          is_active: boolean
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          freelancer_id: string
          category_id: number
          title: string
          description: string
          price: number
          delivery_time: number
          images?: string[] | null
          skills?: string[] | null
          status?: string
          is_active?: boolean
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          freelancer_id?: string
          category_id?: number
          title?: string
          description?: string
          price?: number
          delivery_time?: number
          images?: string[] | null
          skills?: string[] | null
          status?: string
          is_active?: boolean
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: number
          client_id: string
          category_id: number
          title: string
          description: string
          budget: number
          duration: string
          experience_level: string
          skills: string[] | null
          status: string
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          client_id: string
          category_id: number
          title: string
          description: string
          budget: number
          duration: string
          experience_level: string
          skills?: string[] | null
          status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          client_id?: string
          category_id?: number
          title?: string
          description?: string
          budget?: number
          duration?: string
          experience_level?: string
          skills?: string[] | null
          status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}