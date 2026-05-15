'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase, Product, Category } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Search, ArrowLeft, Filter, SlidersHorizontal, ChevronRight, LayoutGrid } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageLoader from '@/components/PageLoader'
import Link from 'next/link'

export default function CategoryDetailPage() {
    const { t } = useLanguage()
    const params = useParams()
    const router = useRouter()
    
    const [category, setCategory] = useState<Category | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [otherCategories, setOtherCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [productsLoading, setProductsLoading] = useState(false)
    
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [sizes, setSizes] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<string>('newest')
    
    const [currentPage, setCurrentPage] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const itemsPerPage = 12

    useEffect(() => {
        if (params.id) {
            fetchCategoryData()
            fetchSizes()
            fetchOtherCategories()
        }
    }, [params.id])

    useEffect(() => {
        if (params.id) {
            setCurrentPage(1)
            fetchProducts(1)
        }
    }, [params.id, searchTerm, selectedSize, sortBy])

    useEffect(() => {
        if (params.id) {
            fetchProducts(currentPage)
        }
    }, [currentPage])

    async function fetchCategoryData() {
        setLoading(true)
        const { data } = await supabase
            .from('categories')
            .select('*')
            .eq('id', params.id)
            .single()
        
        if (data) setCategory(data)
        setLoading(false)
    }

    async function fetchSizes() {
        let query = supabase
            .from('product_sizes')
            .select('size_name, products!inner(category_id, available)')
            .gt('stock', 0)
            .eq('products.available', true)
            .eq('products.category_id', params.id)
        
        const { data } = await query
        
        if (data) {
            const uniqueSizes = Array.from(new Set(data.map(s => s.size_name)))
                .sort((a, b) => {
                    const aNum = parseFloat(a)
                    const bNum = parseFloat(b)
                    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
                    return a.localeCompare(b)
                })
            setSizes(uniqueSizes)
        }
    }

    async function fetchOtherCategories() {
        const { data } = await supabase
            .from('categories')
            .select('*')
            .neq('id', params.id)
            .limit(6)
        
        if (data) setOtherCategories(data)
    }

    async function fetchProducts(page = currentPage) {
        setProductsLoading(true)
        let query = supabase
            .from('products')
            .select(selectedSize ? '*, product_sizes!inner(*)' : '*, product_sizes(*)', { count: 'exact' })
            .eq('category_id', params.id)
            .eq('available', true)
            .gt('stock', 0)
            .gt('base_price', 0)
            .not('image_url', 'is', null)
            .neq('image_url', '')

        if (selectedSize) {
            query = query.eq('product_sizes.size_name', selectedSize)
        }

        if (searchTerm) {
            query = query.ilike('name', `%${searchTerm}%`)
        }

        switch (sortBy) {
            case 'newest':
                query = query.order('created_at', { ascending: false })
                break
            case 'price_low':
                query = query.order('base_price', { ascending: true })
                break
            case 'price_high':
                query = query.order('base_price', { ascending: false })
                break
            case 'name':
                query = query.order('name', { ascending: true })
                break
        }

        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1
        
        const { data, count } = await query.range(from, to)
        
        if (data) setProducts(data)
        if (count !== null) setTotalProducts(count)
        setProductsLoading(false)
    }

    if (loading) return <PageLoader />
    if (!category) return <div className="min-h-screen flex items-center justify-center">Catégorie non trouvée</div>

    return (
        <div className="min-h-screen bg-white">
            {/* Elegant Hero Section */}
            <div className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
                {/* Background Image without Filter */}
                <div className="absolute inset-0">
                    <Image
                        src="/female_activewear_background_1778868386635.png"
                        alt={category.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <Link 
                        href="/categories"
                        className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-8 transition-all bg-black/20 backdrop-blur-md px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-white/20 hover:bg-black/30 shadow-lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t.categories}</span>
                    </Link>
                    <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)] tracking-tight leading-none">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-white text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] leading-relaxed italic">
                            {category.description}
                        </p>
                    )}
                </div>
                
                {/* Modern Bottom Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-24">
                {/* Filters Bar - More Minimalist */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 mb-16 border border-gray-50 flex flex-col md:flex-row gap-2 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-transparent border-none focus:ring-0 transition-all text-gray-900 font-medium placeholder:text-gray-300 text-lg"
                        />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto p-1 bg-gray-50 rounded-[2rem]">
                        <div className="relative flex-1 md:w-56">
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full pl-6 pr-10 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary-500/20 transition-all text-gray-900 font-bold appearance-none cursor-pointer text-sm shadow-sm"
                            >
                                <option value="">{t.allSizes}</option>
                                {sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>

                        <div className="relative flex-1 md:w-56">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-6 pr-10 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary-500/20 transition-all text-gray-900 font-bold appearance-none cursor-pointer text-sm shadow-sm"
                            >
                                <option value="newest">{t.sortNewest}</option>
                                <option value="price_low">{t.sortPriceLowHigh}</option>
                                <option value="price_high">{t.sortPriceHighLow}</option>
                                <option value="name">{t.sortNameAZ}</option>
                            </select>
                            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {productsLoading && products.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-3xl"></div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.noProductsFound}</h3>
                        <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalProducts > itemsPerPage && (
                            <div className="flex justify-center pt-12">
                                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-3 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    {[...Array(Math.ceil(totalProducts / itemsPerPage))].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-primary-500 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalProducts / itemsPerPage), prev + 1))}
                                        disabled={currentPage === Math.ceil(totalProducts / itemsPerPage)}
                                        className="p-3 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Suggestions Section */}
                {otherCategories.length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tight">
                                {t.youMayAlsoLike}
                            </h2>
                            <Link href="/categories" className="text-primary-600 font-bold hover:underline flex items-center gap-2">
                                {t.allCategories} <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherCategories.map((cat) => (
                                <Link 
                                    key={cat.id} 
                                    href={`/categories/${cat.id}`}
                                    className="group relative h-48 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-primary-100"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-pink via-white to-brand-teal group-hover:scale-110 transition-transform duration-700"></div>
                                    <div className="absolute inset-0 flex flex-col justify-center p-8 z-10">
                                        <h3 className="text-2xl font-serif text-gray-900 mb-2">{cat.name}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{cat.description}</p>
                                        <div className="mt-4 flex items-center gap-2 text-primary-600 font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                                            Explorer <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
