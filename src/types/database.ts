export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quiz_results: {
        Row: {
          id: string
          user_id: string
          quiz_type: string
          score: number
          total_questions: number
          answers: Json | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_type: string
          score: number
          total_questions: number
          answers?: Json | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_type?: string
          score?: number
          total_questions?: number
          answers?: Json | null
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      learning_progress: {
        Row: {
          id: string
          user_id: string
          material_slug: string
          completed: boolean | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          material_slug: string
          completed?: boolean | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          material_slug?: string
          completed?: boolean | null
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_circuits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          nodes: Json
          edges: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          nodes: Json
          edges: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          nodes?: Json
          edges?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_circuits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
