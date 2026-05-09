'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase, Category, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { Grid, List, ArrowRight } from 'lucide-react'
import PageLoader from '@/components/PageLoader'

export default function CategoriesPage() {
    const { t } = useLanguage()
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({})
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        fetchCategoriesAndProducts()
    }, [])

    async function fetchCategoriesAndProducts() {
        setLoading(true)

        // Fetch categories
        const { data: categoriesData } = await supabase
            .from('categories')
            .select('*')
            .order('name')

        if (categoriesData) {
            setCategories(categoriesData)

            // Fetch products for each category (limit 4 per category for preview)
            const productsMap: Record<string, Product[]> = {}

            for (const category of categoriesData) {
                const { data: products } = await supabase
                    .from('products')
                    .select('*, product_sizes(*)')
                    .eq('category_id', category.id)
                    .eq('available', true)
                    .gt('stock', 0)
                    .gt('base_price', 0)
                    .not('image_url', 'is', null)
                    .neq('image_url', '')
                    .limit(4)

                if (products) {
                    productsMap[category.id] = products
                }
            }

            setCategoryProducts(productsMap)
        }

        setLoading(false)
    }

    function handleCategoryClick(categoryId: string) {
        router.push(`/?category=${categoryId}`)
    }

    if (loading) {
        return <PageLoader />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
            {/* Header */}
            <div
                className="relative bg-gradient-fashion text-white py-16 px-4 overflow-hidden"
                style={{
                    backgroundImage: 'url(/images/categories-background.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Overlay for better text readability - minimal opacity */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                        {t.categories}
                    </h1>
                    <p className="text-xl text-white drop-shadow-md">
                        Explorez notre collection par catégorie
                    </p>
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                            ? 'bg-gradient-fashion text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                            ? 'bg-gradient-fashion text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                {categories.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Aucune catégorie disponible</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {categories.map((category) => {
                            const products = categoryProducts[category.id] || []

                            return (
                                <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-primary-100">
                                    {/* Category Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                                {category.name}
                                            </h2>
                                            {category.description && (
                                                <p className="text-gray-600 text-sm md:text-base mt-1">{category.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleCategoryClick(category.id)}
                                            className="flex items-center justify-center space-x-2 bg-gradient-fashion text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg group text-sm md:text-base"
                                        >
                                            <span>Voir tout</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>

                                    {/* Products Preview */}
                                    {products.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">Aucun produit dans cette catégorie</p>
                                    ) : viewMode === 'grid' ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                                            {products.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => router.push(`/product/${product.id}`)}
                                                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group"
                                                >
                                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                        {product.image_url ? (
                                                            <Image
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                                            {product.base_price.toFixed(2)} DH
                                                        </p>
                                                        {(product.stock ?? 0) > 0 ? (
                                                            <span className="text-xs text-green-600 font-medium">✓ {t.available}</span>
                                                        ) : (
                                                            <span className="text-xs text-red-600 font-medium">{t.outOfStock}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
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
