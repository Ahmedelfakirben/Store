'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Product, ProductSize } from '@/lib/supabase'

interface CartItem {
    product: Product
    size?: ProductSize
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Product, size?: ProductSize, quantity?: number) => void
    removeItem: (productId: string, sizeId?: string) => void
    updateQuantity: (productId: string, quantity: number, sizeId?: string) => void
    clearCart: () => void
    total: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (error) {
                console.error('Error loading cart:', error)
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addItem = (product: Product, size?: ProductSize, quantity: number = 1) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) =>
                    item.product.id === product.id &&
                    item.size?.id === size?.id
            )

            if (existingIndex > -1) {
                // Update quantity if item exists
                const newItems = [...prev]
                newItems[existingIndex].quantity += quantity
                return newItems
            } else {
                // Add new item
                return [...prev, { product, size, quantity }]
            }
        })
    }

    const removeItem = (productId: string, sizeId?: string) => {
        setItems((prev) =>
            prev.filter(
                (item) =>
                    !(item.product.id === productId && item.size?.id === sizeId)
            )
        )
    }

    const updateQuantity = (productId: string, quantity: number, sizeId?: string) => {
        if (quantity <= 0) {
            removeItem(productId, sizeId)
            return
        }

        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId && item.size?.id === sizeId
                    ? { ...item, quantity }
                    : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const total = items.reduce((sum, item) => {
        const price = item.size
            ? item.product.base_price + item.size.price_modifier
            : item.product.base_price
        return sum + price * item.quantity
    }, 0)

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
