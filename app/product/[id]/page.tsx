'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase, Product, ProductSize } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import { ShoppingCart, ArrowLeft } from 'lucide-react'

export default function ProductDetailPage() {
    const { t } = useLanguage()
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const [product, setProduct] = useState<Product | null>(null)
    const [sizes, setSizes] = useState<ProductSize[]>([])
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

            const { data: sizesData } = await supabase
                .from('product_sizes')
                .select('*')
                .eq('product_id', params.id)
                .gt('stock', 0)

            if (sizesData && sizesData.length > 0) {
                // Map size_name to size for convenience
                const mappedSizes = sizesData.map(s => ({ ...s, size: s.size_name }))
                setSizes(mappedSizes)
                setSelectedSize(mappedSizes[0].size_name)
            }
        }
        setLoading(false)
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
                        {/* Product Image */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
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
                                                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${selectedSize === size.size_name
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                    : 'border-gray-300 hover:border-primary-300'
                                                    }`}
                                            >
                                                {size.size_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="block font-semibold text-gray-900 mb-3">
                                    {t.quantity}
                                </label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors font-bold"
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        ({maxStock} {t.available})
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={maxStock === 0}
                                className="w-full bg-gradient-fashion text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>{maxStock > 0 ? t.addToCart : t.outOfStock}</span>
                            </button>

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
