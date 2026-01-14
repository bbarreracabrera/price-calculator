export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          is_pro: boolean
          calculations_count: number
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          is_pro?: boolean
          calculations_count?: number
          created_at?: string
        }
        Update: {
          email?: string | null
          is_pro?: boolean | null
          calculations_count?: number
          created_at?: string
        }
      }
      calculations: {
        Row: {
          id: string
          user_id: string
          expression: string
          result: number
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          expression: string
          result: number
          created_at?: string
        }
        Update: {
          expression?: string
          result?: number
          created_at?: string
        }
      }
      mp_preferences: {
        Row: {
          id: string
          user_id: string
          mp_preference_id: string
          amount: number
          description: string
          status: string
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          mp_preference_id: string
          amount: number
          description: string
          status: string
          created_at?: string
        }
        Update: {
          mp_preference_id?: string
          amount?: number
          description?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}
