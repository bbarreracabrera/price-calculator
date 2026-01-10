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
    }
  }
}
