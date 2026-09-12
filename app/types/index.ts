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

export type OrderStatus = "pending" | "completed" | "archived";

export interface Order {
  id: number | string;
  user_id: string;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  session_id?: string | null;
  payment_method?: string;
  created_at: string;
}

export interface RestaurantShift {
  id: string;
  restaurant_id: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at?: string;
}

export interface CashierSession {
  id: string;
  restaurant_id: string;
  user_id?: string | null;
  shift_id?: string | null;
  shift_name?: string | null;
  status: "open" | "closed";
  opening_balance: number;
  closing_balance?: number | null;
  expected_cash?: number;
  cash_sales?: number;
  card_sales?: number;
  total_sales?: number;
  orders_count?: number;
  difference?: number;
  opened_at: string;
  closed_at?: string | null;
  notes?: string | null;
}

export interface Plan {
  id: "free" | "basic" | "pro" | string;
  name_ar: string;
  name_en: string;
  max_items: number;
  max_categories: number;
  allow_analytics: boolean;
  allow_branches: boolean;
  allow_tables: boolean;
  allow_whatsapp_orders: boolean;
  allow_custom_hours: boolean;
  allow_shifts: boolean;
  allow_extras: boolean;
  allow_cashier: boolean;
  allow_multi_languages: boolean;
  allow_users: boolean;
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
  plan_type?: "free" | "basic" | "pro" | "unlimited" | string;
  plan_id?: string;
  plans?: Plan;
  plan?: Plan;
  max_items?: number;
  max_categories?: number;
  subscription_status?: "active" | "expired" | "trial" | string;
  subscription_end_date?: string;
}

