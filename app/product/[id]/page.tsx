'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase, Product, ProductSize } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/hooks/useSettings'
import { ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react'
import PageLoader from '@/components/PageLoader'
import ProductCard from '@/components/ProductCard'

export default function ProductDetailPage() {
    const { t } = useLanguage()
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const { settings } = useSettings()
    const [product, setProduct] = useState<Product | null>(null)
    const [sizes, setSizes] = useState<ProductSize[]>([])
    const [gallery, setGallery] = useState<{ image_url: string }[]>([])
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
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
                    .sort((a, b) => {
                        const aVal = a.size_name
                        const bVal = b.size_name
                        const aNum = parseFloat(aVal)
                        const bNum = parseFloat(bVal)
                        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
                        
                        const sizeOrder = ['XXS', 'XS', 'XS/S', 'S', 'S/M', 'M', 'M/L', 'L', 'L/XL', 'XL', 'XXL', 'XXXL', '3XL', '4XL', '5XL']
                        const aIndex = sizeOrder.indexOf(aVal.toUpperCase())
                        const bIndex = sizeOrder.indexOf(bVal.toUpperCase())
                        
                        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
                        if (aIndex !== -1) return -1
                        if (bIndex !== -1) return 1
                        
                        return aVal.localeCompare(bVal)
                    })
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

            // Fetch related products
            const { data: relatedData } = await supabase
                .from('products')
                .select('*, product_sizes(*)')
                .eq('category_id', productData.category_id)
                .neq('id', params.id)
                .eq('available', true)
                .gt('stock', 0)
                .limit(6)
            
            if (relatedData) {
                const availableRelated = (relatedData as Product[]).filter(product => {
                    if (product.product_sizes && product.product_sizes.length > 0) {
                        return product.product_sizes.some(s => s.stock > 0)
                    }
                    return (product.stock ?? 0) > 0
                })
                setRelatedProducts(availableRelated)
            }
        }
        setLoading(false)
    }

    function handleWhatsAppOrder() {
        if (!product || !settings) return

        const sizeInfo = selectedSize ? `Taille : ${selectedSize}` : ''
        const message = `Bonjour ! J'aimerais acheter ce produit :\n\n*${product.name}*\n${sizeInfo}\nPrix : ${product.base_price} DH\n\nLien : ${window.location.href}`
        
        let cleanedPhone = settings.phone.replace(/\s+/g, '').replace(/^\+/, '')
        // If the phone starts with standard local 0, replace it with Morocco code '212'
        if (cleanedPhone.startsWith('0')) {
            cleanedPhone = '212' + cleanedPhone.substring(1)
        } else if (!cleanedPhone.startsWith('212')) {
            cleanedPhone = '212' + cleanedPhone
        }

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encodedMessage}`
        
        window.location.href = whatsappUrl
    }

    function handleAddToCart() {
        if (!product) return

        const selectedSizeObj = sizes.find(s => s.size_name === selectedSize)
        addItem(product, selectedSizeObj, quantity)

        router.push('/cart')
    }

    if (loading) {
        return <PageLoader />
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
                                        sizes="(max-width: 768px) 100vw, 50vw"
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
                                        <Image src={product.image_url || ''} alt="Thumbnail" fill sizes="120px" className="object-cover" />
                                    </button>
                                    {gallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img.image_url)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.image_url ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-primary-200'}`}
                                        >
                                            <Image src={img.image_url} alt={`Gallery ${idx}`} fill sizes="120px" className="object-cover" />
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
                                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-bold hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 shadow-lg"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    <span>{t.orderViaWhatsApp}</span>
                                </button>

                                {/* Add to Cart (Secondary) */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={maxStock === 0}
                                    className="w-full border border-primary-200 bg-gradient-to-r from-primary-50 to-pink-50/50 hover:from-primary-100 hover:to-pink-100/50 text-primary-600 py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow"
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

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="max-w-7xl mx-auto mt-24">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {t.youMayAlsoLike}
                        </h2>
                        <div className="h-1 flex-1 bg-gray-100 mx-8 rounded-full hidden md:block"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
