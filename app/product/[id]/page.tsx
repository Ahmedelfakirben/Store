'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase, Product, ProductSize } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/hooks/useSettings'
import { ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react'

export default function ProductDetailPage() {
    const { t } = useLanguage()
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const { settings } = useSettings()
    const [product, setProduct] = useState<Product | null>(null)
    const [sizes, setSizes] = useState<ProductSize[]>([])
    const [gallery, setGallery] = useState<{ image_url: string }[]>([])
    const [selectedImage, setSelectedImage] = useState<string>('')
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProduct()
    }, [params.id])

    async function fetchProduct() {
        const { data: productData } = await supabase
            .from('products')
            .select('*')
            .eq('id', params.id)
            .single()

        if (productData) {
            setProduct(productData)
            setSelectedImage(productData.image_url || '')

            // Fetch sizes
            const { data: sizesData } = await supabase
                .from('product_sizes')
                .select('*')
                .eq('product_id', params.id)
                .gt('stock', 0)

            if (sizesData && sizesData.length > 0) {
                const mappedSizes = sizesData.map(s => ({ ...s, size: s.size_name }))
                setSizes(mappedSizes)
                setSelectedSize(mappedSizes[0].size_name)
            }

            // Fetch gallery
            const { data: galleryData } = await supabase
                .from('product_images')
                .select('image_url')
                .eq('product_id', params.id)
                .order('display_order', { ascending: true })

            if (galleryData) {
                setGallery(galleryData)
            }
        }
        setLoading(false)
    }

    function handleWhatsAppOrder() {
        if (!product || !settings) return

        const sizeInfo = selectedSize ? `Talla: ${selectedSize}` : ''
        const message = `Hola! Me gustaría comprar este producto:\n\n*${product.name}*\n${sizeInfo}\nPrecio: ${product.base_price} DH\n\nLink: ${window.location.href}`
        
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${settings.phone.replace(/\s+/g, '')}?text=${encodedMessage}`
        
        window.open(whatsappUrl, '_blank')
    }

    function handleAddToCart() {
        if (!product) return

        const selectedSizeObj = sizes.find(s => s.size_name === selectedSize)
        addItem(product, selectedSizeObj, quantity)

        router.push('/cart')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Produit non trouvé</p>
            </div>
        )
    }

    const maxStock = sizes.length > 0
        ? (sizes.find(s => s.size_name === selectedSize)?.stock ?? 0)
        : (product.stock ?? 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Retour</span>
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Product Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                {selectedImage ? (
                                    <Image
                                        src={selectedImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Pas d'image
                                    </div>
                                )}
                            </div>
                            
                            {/* Thumbnails */}
                            {gallery.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    <button
                                        onClick={() => setSelectedImage(product.image_url || '')}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === product.image_url ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-primary-200'}`}
                                    >
                                        <Image src={product.image_url || ''} alt="Thumbnail" fill className="object-cover" />
                                    </button>
                                    {gallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img.image_url)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.image_url ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-primary-200'}`}
                                        >
                                            <Image src={img.image_url} alt={`Gallery ${idx}`} fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                            <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
                                {product.base_price.toFixed(2)} DH
                            </div>

                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">{t.productDetails}</h3>
                                    <p className="text-gray-600">{product.description}</p>
                                </div>
                            )}

                            {/* Size Selection */}
                            {sizes.length > 0 && (
                                <div className="mb-6">
                                    <label className="block font-semibold text-gray-900 mb-3">
                                        {t.selectSize}
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedSize(size.size_name)}
                                                className={`py-3 px-4 rounded-lg border-2 font-bold transition-all ${selectedSize === size.size_name
                                                    ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                                                    : 'border-gray-200 bg-white text-gray-800 hover:border-primary-400 hover:text-primary-600'
                                                    }`}
                                            >
                                                {size.size_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-4 mt-auto">
                                {/* WhatsApp Button (Primary) */}
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    <span>{t.orderViaWhatsApp}</span>
                                </button>

                                {/* Add to Cart (Secondary) */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={maxStock === 0}
                                    className="w-full border-2 border-primary-200 text-primary-600 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>{maxStock > 0 ? t.addToCart : t.outOfStock}</span>
                                </button>
                            </div>

                            {/* Stock Status */}
                            <div className="mt-4 text-center">
                                {maxStock > 0 ? (
                                    <span className="text-green-600 font-medium">✓ {t.available}</span>
                                ) : (
                                    <span className="text-red-600 font-medium">✗ {t.unavailable}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
