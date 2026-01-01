'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Package, CheckCircle, ChevronDown, ChevronUp, MapPin, Phone, MessageCircle } from 'lucide-react'

interface OrderItem {
    id: string
    product_name: string
    product_size: string | null
    quantity: number
    unit_price: number
}

interface Order {
    id: string
    created_at: string
    total: number
    status: string
    shipping_address: string
    phone: string
    items?: OrderItem[]
}

function OrdersContent() {
    const { t } = useLanguage()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        if (searchParams.get('success') === 'true') {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 5000)
        }

        fetchOrders()
    }, [user])

    async function fetchOrders() {
        if (!user) return

        const { data } = await supabase
            .from('online_orders')
            .select('*')
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false })

        if (data) setOrders(data)
        setLoading(false)
    }

    async function toggleOrderExpansion(orderId: string) {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null)
            return
        }

        // Fetch order items if not already loaded
        const order = orders.find(o => o.id === orderId)
        if (order && !order.items) {
            const { data } = await supabase
                .from('order_items_online')
                .select('*')
                .eq('order_id', orderId)

            if (data) {
                setOrders(orders.map(o =>
                    o.id === orderId ? { ...o, items: data } : o
                ))
            }
        }

        setExpandedOrderId(orderId)
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'processing': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'delivered': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    function getStatusText(status: string) {
        switch (status) {
            case 'pending': return 'En attente'
            case 'processing': return 'En préparation'
            case 'shipped': return 'Expédié'
            case 'delivered': return 'Livré'
            case 'cancelled': return 'Annulé'
            default: return status
        }
    }

    function getProgressPercentage(status: string) {
        switch (status) {
            case 'pending': return 25
            case 'processing': return 50
            case 'shipped': return 75
            case 'delivered': return 100
            default: return 0
        }
    }

    function generateContactMessage(order: Order) {
        const orderDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })

        let message = `Bonjour,\n\n`
        message += `Je souhaite obtenir des informations concernant ma commande:\n\n`
        message += `📦 Commande #${order.id.slice(0, 8)}\n`
        message += `📅 Date: ${orderDate}\n`
        message += `💰 Montant: ${order.total.toFixed(2)} DH\n`
        message += `📍 Adresse: ${order.shipping_address}\n`
        message += `📱 Téléphone: ${order.phone}\n`
        message += `\nStatut actuel: ${getStatusText(order.status)}\n\n`

        if (order.items && order.items.length > 0) {
            message += `Articles commandés:\n`
            order.items.forEach((item, index) => {
                message += `${index + 1}. ${item.product_name}`
                if (item.product_size) message += ` (Taille: ${item.product_size})`
                message += ` - Qté: ${item.quantity} - ${item.unit_price.toFixed(2)} DH\n`
            })
        }

        message += `\nMerci!`

        // WhatsApp link with pre-filled message
        const whatsappNumber = '212600000000' // Replace with actual number
        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Success Message */}
                {showSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-semibold text-green-900">Commande créée avec succès!</p>
                            <p className="text-sm text-green-700">Nous vous contacterons bientôt pour confirmer votre commande.</p>
                        </div>
                    </div>
                )}

                <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Package className="w-8 h-8 text-primary-600" />
                    {t.myOrdersTitle}
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-primary-100">
                        <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 mb-4">{t.noOrders}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gradient-fashion text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all shadow-md"
                        >
                            {t.shopNow}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const isExpanded = expandedOrderId === order.id
                            return (
                                <div key={order.id} className="bg-white rounded-xl shadow-md border border-primary-100 overflow-hidden hover:shadow-lg transition-all">
                                    {/* Order Header - Clickable */}
                                    <div
                                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleOrderExpansion(order.id)}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        Commande #{order.id.slice(0, 8)}
                                                    </h3>
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-primary-500" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <span>{new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">{t.totalAmount}</p>
                                                <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                                    {order.total.toFixed(2)} DH
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                                                <span>En attente</span>
                                                <span>Préparation</span>
                                                <span>Expédié</span>
                                                <span>Livré</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-fashion h-2 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                                    style={{ width: `${getProgressPercentage(order.status)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 bg-gray-50 p-6 animate-in slide-in-from-top-2 duration-200">
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                                <Package className="w-4 h-4 mr-2 text-primary-500" />
                                                Articles commandés
                                            </h4>

                                            {order.items && order.items.length > 0 ? (
                                                <div className="space-y-3 mb-6">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-100 flex items-center gap-4 shadow-sm">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900">{item.product_name}</p>
                                                                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                                                    {item.product_size && (
                                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                                                                            Taille: {item.product_size}
                                                                        </span>
                                                                    )}
                                                                    <span>x{item.quantity}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-primary-600">
                                                                    {item.unit_price.toFixed(2)} DH
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    <div className="animate-pulse flex justify-center mb-2">
                                                        <div className="h-2 w-2 bg-gray-400 rounded-full mx-1"></div>
                                                        <div className="h-2 w-2 bg-gray-400 rounded-full mx-1"></div>
                                                        <div className="h-2 w-2 bg-gray-400 rounded-full mx-1"></div>
                                                    </div>
                                                    Chargement des détails...
                                                </div>
                                            )}

                                            <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p className="font-semibold text-gray-900 mb-2">Informations de livraison</p>
                                                    <p className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        {order.shipping_address}
                                                    </p>
                                                    <p className="flex items-center">
                                                        <Phone className="w-4 h-4 mr-2" />
                                                        {order.phone || 'N/A'}
                                                    </p>
                                                </div>

                                                <div className="flex items-end justify-end">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            generateContactMessage(order)
                                                        }}
                                                        className="w-full md:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                                    >
                                                        <MessageCircle className="w-5 h-5" />
                                                        Besoin d'aide ?
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div></div>}>
            <OrdersContent />
        </Suspense>
    )
}
