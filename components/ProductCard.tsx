'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/supabase'
import { ShoppingCart } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const { t } = useLanguage()
    const isNew = new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000

    return (
        <Link href={`/product/${product.id}`}>
            <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-primary-100 hover:border-primary-300 transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingCart className="w-16 h-16" />
                        </div>
                    )}

                    {/* NEW Badge */}
                    {isNew && (
                        <div className="absolute top-3 right-3 bg-gradient-fashion text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {t.new}
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                            <div className="bg-white text-primary-600 px-4 py-2 rounded-full font-semibold flex items-center space-x-2 shadow-lg">
                                <ShoppingCart className="w-4 h-4" />
                                <span>{t.addToCart}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            {(product.base_price ?? 0).toFixed(2)} DH
                        </div>

                        {(product.stock ?? 0) > 0 ? (
                            <span className="text-xs text-green-600 font-medium">
                                ✓ {t.available}
                            </span>
                        ) : (
                            <span className="text-xs text-red-600 font-medium">
                                {t.outOfStock}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
