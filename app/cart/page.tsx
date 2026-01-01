'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { Trash2, ShoppingBag, Clock } from 'lucide-react'

export default function CartPage() {
    const { t } = useLanguage()
    const router = useRouter()
    const { items, removeItem, updateQuantity, total } = useCart()
    const { user } = useAuth()

    // Recent Orders State
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loadingOrders, setLoadingOrders] = useState(true)

    // Fetch recent orders for empty state
    useEffect(() => {
        async function fetchRecentOrders() {
            if (!user) {
                setLoadingOrders(false)
                return
            }

            const { data } = await supabase
                .from('online_orders')
                .select('*')
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false })
                .limit(2) // Only show top 2 items

            if (data) setRecentOrders(data)
            setLoadingOrders(false)
        }

        if (items.length === 0) {
            fetchRecentOrders()
        }
    }, [user, items.length])

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

                    {/* Recent Orders Section (Only if logged in and has orders) */}
                    {user && !loadingOrders && recentOrders.length > 0 && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-8 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary-500" />
                                    Vos dernières commandes
                                </h3>
                                <button
                                    onClick={() => router.push('/orders')}
                                    className="text-primary-600 hover:text-primary-700 font-medium text-sm hover:underline"
                                >
                                    Voir tout
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-all cursor-pointer bg-white"
                                        onClick={() => router.push('/orders')}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-900">CMD #{order.id.slice(0, 8)}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-sm text-gray-600">{order.shipping_address?.split(',')[0]}...</p>
                                            <p className="font-bold text-primary-600">{order.total?.toFixed(2) || '0.00'} DH</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
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

                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full bg-gradient-fashion text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg mb-3"
                            >
                                {t.proceedToCheckout}
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
