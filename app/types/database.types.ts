export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          role: 'super_admin' | 'admin' | 'user'
          business_name: string | null
          business_name_ar: string | null
          business_name_en: string | null
          logo: string | null
          slug: string | null
          categories: string[] | null
          whatsapp_number: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']>
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      menu_items: {
        Row: {
          id: string
          user_id: string
          name: string
          name_ar: string | null
          description: string | null
          description_ar: string | null
          price: number
          category: string | null
          image_url: string | null
        }
        Insert: Partial<Database['public']['Tables']['menu_items']['Row']>
        Update: Partial<Database['public']['Tables']['menu_items']['Row']>
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: any
          total_price: number
          status: string
          created_at: string
          table_number: string | null
        }
        Insert: Partial<Database['public']['Tables']['orders']['Row']>
        Update: Partial<Database['public']['Tables']['orders']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
