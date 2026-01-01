import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the shop
export interface Product {
    id: string
    category_id: string | null
    name: string
    description: string
    base_price: number
    purchase_price?: number
    image_url?: string
    available: boolean
    brand?: string
    material?: string
    gender?: string
    season?: string
    stock?: number
    barcode?: string
    created_at: string
}

export interface ProductSize {
    id: string
    product_id: string
    size_name: string
    size: string  // Alias for size_name for convenience
    price_modifier: number
    stock: number
    created_at: string
}

export interface Category {
    id: string
    name: string
    description: string
    created_at: string
}

export interface CustomerProfile {
    id: string
    email: string
    full_name?: string
    phone?: string
    address?: string
    city?: string
    postal_code?: string
    default_address?: string
    created_at: string
    updated_at: string
}

export interface OnlineOrder {
    id: string
    order_number: number
    customer_id: string
    total: number
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'shipped' | 'delivered' | 'cancelled'
    delivery_address?: string
    delivery_notes?: string
    payment_method?: string
    payment_status: 'pending' | 'completed' | 'failed'
    created_at: string
    updated_at: string
}

export interface OrderItemOnline {
    id: string
    order_id: string
    product_id?: string
    product_name: string
    product_size?: string
    quantity: number
    unit_price: number
    created_at: string
}
