'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export default function CartPage() {
    const { t } = useLanguage()
    const router = useRouter()
    const { items, removeItem, updateQuantity, total } = useCart()
    const { settings } = useSettings()

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Empty State Hero */}
                    <div className="text-center bg-white rounded-2xl shadow-lg p-12 border border-primary-100">
                        <ShoppingBag className="w-24 h-24 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.emptyCart}</h2>
                        <p className="text-gray-600 mb-8 text-lg">Votre panier est vide pour le moment. Découvrez nos dernières tendances !</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gradient-fashion text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            {t.continueShopping}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    function handleWhatsAppCheckout() {
        if (!settings || items.length === 0) return

        let message = `Hola! Me gustaría comprar los siguientes productos de mi carrito:\n\n`
        
        items.forEach(item => {
            const price = item.size
                ? item.product.base_price + item.size.price_modifier
                : item.product.base_price
            
            message += `- *${item.product.name}* (x${item.quantity})`
            if (item.size) message += ` [Talla: ${item.size.size_name}]`
            message += `: ${price * item.quantity} DH\n`
        })

        message += `\n*TOTAL: ${total.toFixed(2)} DH*\n\n¿Están disponibles?`
        
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${settings.phone.replace(/\s+/g, '')}?text=${encodedMessage}`
        
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">{t.shoppingCart}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const price = item.size
                                ? item.product.base_price + item.size.price_modifier
                                : item.product.base_price

                            return (
                                <div
                                    key={`${item.product.id}-${item.size?.id || 'no-size'}`}
                                    className="bg-white rounded-xl shadow-md p-6 border border-primary-100"
                                >
                                    <div className="flex items-center space-x-4">
                                        {/* Image */}
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {item.product.image_url ? (
                                                <Image
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    ?
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-900">{item.product.name}</h3>
                                            {item.size && (
                                                <p className="text-sm text-gray-600">Taille: {item.size.size_name}</p>
                                            )}
                                            <p className="text-primary-600 font-bold mt-1">
                                                {price.toFixed(2)} DH
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.size?.id)}
                                                className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size?.id)}
                                                className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors font-bold"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeItem(item.product.id, item.size?.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title={t.remove}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-primary-100 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.orderSummary}</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t.subtotal}</span>
                                    <span className="font-semibold">{total.toFixed(2)} DH</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>{t.total}</span>
                                        <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                            {total.toFixed(2)} DH
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Checkout Button */}
                            <button
                                onClick={handleWhatsAppCheckout}
                                className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg mb-4 flex items-center justify-center space-x-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>{t.finishOrderViaWhatsApp}</span>
                            </button>

                            <button
                                onClick={() => router.push('/')}
                                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-primary-500 hover:text-primary-600 transition-all"
                            >
                                {t.continueShopping}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
