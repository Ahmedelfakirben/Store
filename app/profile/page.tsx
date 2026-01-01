'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import { User, MapPin, Phone, Mail, Package, TrendingUp, Edit2, Check, AlertCircle, ShoppingBag, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import Image from 'next/image'

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

export default function ProfilePage() {
    const { t } = useLanguage()
    const router = useRouter()
    const { user, profile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [editing, setEditing] = useState(false)
    const [orders, setOrders] = useState<Order[]>([])
    const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 })
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    })

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        if (profile) {
            setFormData({
                fullName: profile.full_name || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                postalCode: profile.postal_code || '',
            })
        }

        fetchOrders()
    }, [user, profile])

    async function fetchOrders() {
        if (!user) return

        const { data } = await supabase
            .from('online_orders')
            .select('*')
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setOrders(data)
            const total = data.reduce((sum, order) => sum + order.total, 0)
            setStats({ totalOrders: data.length, totalSpent: total })
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setSuccess(false)

        try {
            const { error } = await supabase
                .from('customer_profiles')
                .update({
                    full_name: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postal_code: formData.postalCode,
                })
                .eq('id', user!.id)

            if (error) throw error

            setSuccess(true)
            setEditing(false)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            console.error('Error updating profile:', err)
        } finally {
            setLoading(false)
        }
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
        const whatsappNumber = '212600000000' // Replace with your actual WhatsApp business number
        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
    }

    const isProfileComplete = formData.phone && formData.address && formData.city

    if (!user) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                        Mon Profil
                    </h1>
                    <p className="text-gray-600">Gérez vos informations et suivez vos commandes</p>
                </div>

                {/* Alert if profile incomplete */}
                {!isProfileComplete && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                            <div>
                                <p className="font-semibold text-yellow-800">Profil incomplet</p>
                                <p className="text-sm text-yellow-700">Veuillez compléter votre téléphone et adresse pour passer commande.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-50">
                            <div className="text-center">
                                <div className="inline-block p-1 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary-300 to-accent-300 rounded-full flex items-center justify-center shadow-inner">
                                        <User className="w-10 h-10 text-white opacity-90" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{formData.fullName || 'Client'}</h2>
                                <p className="text-gray-500 text-sm mt-2 font-medium">{user.email}</p>
                                <div className="mt-6 pt-6 border-t border-gray-50">
                                    <span className="inline-block px-4 py-1.5 bg-gray-50 text-gray-500 text-xs font-semibold tracking-wider uppercase rounded-full">
                                        Membre depuis {new Date(user.created_at || '').toLocaleDateString('fr-FR', {
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
                                Statistiques
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                                    <div className="flex items-center">
                                        <ShoppingBag className="w-8 h-8 text-primary-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-600">Commandes</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Package className="w-8 h-8 text-accent-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-600">Total dépensé</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalSpent.toFixed(2)} DH</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info & Orders */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Informations Personnelles</h3>
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span>{editing ? 'Annuler' : 'Modifier'}</span>
                                </button>
                            </div>

                            {success && (
                                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                                    <Check className="w-5 h-5 mr-2" />
                                    Profil mis à jour avec succès!
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <User className="w-4 h-4 mr-2 text-gray-500" />
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            disabled={!editing}
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 text-gray-900 font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user.email || ''}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                            Téléphone <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            disabled={!editing}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 text-gray-900 font-medium"
                                            placeholder="+212 600 000 000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                            Ville <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            disabled={!editing}
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 text-gray-900 font-medium"
                                            placeholder="Casablanca"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                            Adresse complète <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            disabled={!editing}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 text-gray-900 font-medium"
                                            placeholder="123 Avenue Mohammed V"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Code postal
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!editing}
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 text-gray-900 font-medium"
                                            placeholder="20000"
                                        />
                                    </div>
                                </div>

                                {editing && (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-fashion text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <Check className="w-5 h-5" />
                                        <span>{loading ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Orders Section */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Package className="w-6 h-6 mr-2 text-primary-500" />
                                Mes Commandes
                            </h3>

                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">Aucune commande pour le moment</p>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="mt-4 bg-gradient-fashion text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all shadow-md"
                                    >
                                        Commencer mes achats
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => {
                                        const isExpanded = expandedOrderId === order.id
                                        return (
                                            <div key={order.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition-all">
                                                {/* Order Header - Clickable */}
                                                <div
                                                    className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => toggleOrderExpansion(order.id)}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-gray-900">Commande #{order.id.slice(0, 8)}</p>
                                                                {isExpanded ? (
                                                                    <ChevronUp className="w-5 h-5 text-primary-500" />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600">
                                                                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                                                {order.total.toFixed(2)} DH
                                                            </p>
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusColor(order.status)}`}>
                                                                {getStatusText(order.status)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                                                            <span>En attente</span>
                                                            <span>Préparation</span>
                                                            <span>Expédié</span>
                                                            <span>Livré</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-fashion h-2 rounded-full transition-all duration-500"
                                                                style={{ width: `${getProgressPercentage(order.status)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div className="text-sm text-gray-600">
                                                        <p className="flex items-center">
                                                            <MapPin className="w-4 h-4 mr-2" />
                                                            {order.shipping_address}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Expanded Order Details */}
                                                {isExpanded && (
                                                    <div className="border-t border-gray-200 bg-gray-50 p-5">
                                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                            <Package className="w-4 h-4 mr-2" />
                                                            Articles commandés
                                                        </h4>

                                                        {order.items && order.items.length > 0 ? (
                                                            <div className="space-y-3 mb-4">
                                                                {order.items.map((item) => (
                                                                    <div key={item.id} className="bg-white rounded-lg p-3 flex items-center gap-3">
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                                                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                                                                {item.product_size && (
                                                                                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                                                                                        Taille: {item.product_size}
                                                                                    </span>
                                                                                )}
                                                                                <span>Quantité: {item.quantity}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="font-semibold text-primary-600">
                                                                                {item.unit_price.toFixed(2)} DH
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                Total: {(item.unit_price * item.quantity).toFixed(2)} DH
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm mb-4">Chargement des articles...</p>
                                                        )}

                                                        {/* Contact Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                generateContactMessage(order)
                                                            }}
                                                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                                        >
                                                            <MessageCircle className="w-5 h-5" />
                                                            Contacter via WhatsApp
                                                        </button>

                                                        {/* Order Info */}
                                                        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-1">
                                                            <p className="flex items-center">
                                                                <Phone className="w-4 h-4 mr-2" />
                                                                {order.phone}
                                                            </p>
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
                </div>
            </div>
        </div>
    )
}
