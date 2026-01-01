'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import { CreditCard } from 'lucide-react'

export default function CheckoutPage() {
    const { t } = useLanguage()
    const router = useRouter()
    const { user, profile } = useAuth()
    const { items, total, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        fullName: profile?.full_name || '',
        email: user?.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        city: profile?.city || '',
        postalCode: profile?.postal_code || '',
    })

    // Check authentication and profile completeness
    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        // Check if profile is complete
        if (!profile?.phone || !profile?.address || !profile?.city) {
            router.push('/profile?incomplete=true')
            return
        }

        if (items.length === 0) {
            router.push('/cart')
        }
    }, [user, profile, items, router])

    if (!user || !profile?.phone || !profile?.address || !profile?.city || items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Guard against null user
        if (!user) {
            setError('User not authenticated')
            setLoading(false)
            return
        }

        try {
            // Create order
            const { data: order, error: orderError } = await supabase
                .from('online_orders')
                .insert({
                    customer_id: user.id,
                    total: total,
                    status: 'pending',
                    shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
                    phone: formData.phone,
                })
                .select()
                .single()

            if (orderError) throw orderError

            // Create order items
            const orderItems = items.map(item => {
                const price = item.size
                    ? item.product.base_price + item.size.price_modifier
                    : item.product.base_price
                return {
                    order_id: order.id,
                    product_id: item.product.id,
                    product_name: item.product.name,
                    product_size: item.size?.size_name || null,
                    quantity: item.quantity,
                    unit_price: price,
                }
            })

            const { error: itemsError } = await supabase
                .from('order_items_online')
                .insert(orderItems)

            if (itemsError) throw itemsError

            clearCart()
            router.push(`/orders?success=true`)
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la création de la commande')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">{t.checkout}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 border border-primary-100">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            {/* Shipping Address */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.shippingAddress}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.fullName}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.email}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.phone}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                            placeholder="+212 600 000 000"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.fullAddress}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.city}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.postalCode}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.paymentMethod}</h2>
                                <div className="bg-gray-50 border-2 border-primary-300 rounded-lg p-4 flex items-center space-x-3">
                                    <CreditCard className="w-6 h-6 text-primary-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{t.cashOnDelivery}</p>
                                        <p className="text-sm text-gray-600">Payez à la réception de votre commande</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-fashion text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t.placingOrder : t.placeOrder}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-primary-100 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.orderSummary}</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => {
                                    const price = item.size
                                        ? item.product.base_price + item.size.price_modifier
                                        : item.product.base_price
                                    return (
                                        <div key={`${item.product.id}-${item.size?.id || 'no-size'}`} className="flex items-center space-x-3">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.product.image_url ? (
                                                    <Image
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-900">{item.product.name}</p>
                                                {item.size && <p className="text-xs text-gray-600">Taille: {item.size.size_name}</p>}
                                                <p className="text-xs text-gray-600">Qté: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-primary-600">
                                                {(price * item.quantity).toFixed(2)} DH
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>{t.total}</span>
                                    <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                        {total.toFixed(2)} DH
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
