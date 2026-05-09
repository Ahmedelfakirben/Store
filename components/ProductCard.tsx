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
                <div className="p-3 md:p-5">
                    <div className="mb-1 md:mb-2">
                        <h3 className="font-bold text-sm md:text-base text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                            {product.name}
                        </h3>
                    </div>

                    {/* Available Sizes Row */}
                    <div className="flex flex-wrap gap-1 mb-4 h-6 overflow-hidden">
                        {product.product_sizes && product.product_sizes.length > 0 ? (
                            product.product_sizes
                                .filter(s => s.stock > 0)
                                .map((size, idx) => (
                                    <span key={idx} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">
                                        {size.size_name}
                                    </span>
                                ))
                        ) : (
                            <span className="text-[10px] text-gray-400 italic">Taille unique</span>
                        )}
                    </div>

                    <div className="flex items-end justify-between gap-2">
                        <div>
                            <div className="text-lg md:text-xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                {(product.base_price ?? 0).toFixed(2)} DH
                            </div>
                            {(product.stock ?? 0) > 0 ? (
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">
                                        {t.available}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-[10px] text-red-600 font-bold uppercase tracking-tighter">
                                    {t.outOfStock}
                                </span>
                            )}
                        </div>

                        <div className="bg-primary-50 p-2 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                            <ShoppingCart className="w-5 h-5 text-primary-600 group-hover:text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
