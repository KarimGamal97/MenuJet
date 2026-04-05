// ============================================================
// MenuJet — Shared TypeScript Interfaces
// ============================================================

export interface MenuItem {
  id: number | string;
  user_id: string;
  name: string;
  price: number;
  category: string;
  image?: string | null;
  available?: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "completed";

export interface Order {
  id: number | string;
  user_id: string;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

export interface Profile {
  user_id: string;
  business_name?: string;
  business_name_en?: string;
  slug?: string;
  logo?: string | null;
  whatsapp_number?: string;
  categories?: string[];
  is_active?: boolean;
}
