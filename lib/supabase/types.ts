export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          is_pro: boolean
          calculations_count: number
          email: string | null
          created_at: string
        }
        Insert: {
          id: string
          is_pro?: boolean
          calculations_count?: number
          email?: string | null
          created_at?: string
        }
        Update: {
          is_pro?: boolean
          calculations_count?: number
          email?: string | null
          created_at?: string
        }
      }
      calculations: {
        Row: {
          id: string
          user_id: string
          costos_fijos: number | null
          costos_variables: number | null
          horas_trabajo: number | null
          valor_hora: number | null
          margen: number | null
          precio_final: number | null
          ganancia_estimada: number | null
          iva_desglosado: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          costos_fijos?: number | null
          costos_variables?: number | null
          horas_trabajo?: number | null
          valor_hora?: number | null
          margen?: number | null
          precio_final?: number | null
          ganancia_estimada?: number | null
          iva_desglosado?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          costos_fijos?: number | null
          costos_variables?: number | null
          horas_trabajo?: number | null
          valor_hora?: number | null
          margen?: number | null
          precio_final?: number | null
          ganancia_estimada?: number | null
          iva_desglosado?: number | null
          created_at?: string
        }
      }
    }
  }
}

