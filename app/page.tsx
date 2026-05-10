'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Product, Category } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Search, Award, Truck, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/hooks/useSettings'
import PageLoader from '@/components/PageLoader'

function HomeContent() {
  const { t } = useLanguage()
  const { settings } = useSettings()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const itemsPerPage = 20

  useEffect(() => {
    // Check if category is in URL params
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    fetchCategories()
  }, [searchParams])

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    if (data) setCategories(data)
    fetchProducts(1) // Fetch products after categories are loaded
  }

  async function fetchProducts(page = currentPage) {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, product_sizes(*)', { count: 'exact' })
      .eq('available', true)
      .gt('stock', 0) // Only products with stock
      .gt('base_price', 0) // Only products with valid price
      .not('image_url', 'is', null) // Only products with image
      .neq('image_url', '') // Ensure image_url is not an empty string

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }

    // Sorting
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

    // Pagination
    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1
    
    const { data, count } = await query.range(from, to)
    
    if (data) setProducts(data)
    if (count !== null) setTotalProducts(count)
    setLoading(false)
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchProducts(1)
  }, [searchTerm, selectedCategory, sortBy])

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Hero Section */}
      <div
        className="relative bg-gradient-fashion text-white min-h-[90vh] flex items-center px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/hero-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability - minimal opacity */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/10"></div>

        <div className="max-w-7xl mx-auto w-full text-center relative z-10 pt-20">
          <h1 className="text-6xl md:text-8xl font-black mb-6 animate-fade-in drop-shadow-2xl italic tracking-tighter leading-none">
            {settings?.company_name || 'Shopping by Lina'}
          </h1>
          <p className="text-xl md:text-3xl mb-12 text-white font-bold drop-shadow-lg uppercase tracking-[0.25em] opacity-90">
            Activewear & Lifestyle Originals 100%
          </p>
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary-600 px-12 py-5 rounded-full font-black text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-primary-500/20 transform hover:-translate-y-1 active:scale-95"
          >
            {t.shopNow}
          </button>
        </div>
        
        {/* Modern Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </div>

      {/* Search and Filters */}
      <div id="products" className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-primary-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 font-medium bg-white"
            >
              <option value="" className="text-gray-900">{t.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 font-medium bg-white"
            >
              <option value="newest" className="text-gray-900">{t.sortNewest}</option>
              <option value="price_low" className="text-gray-900">{t.sortPriceLowHigh}</option>
              <option value="price_high" className="text-gray-900">{t.sortPriceHighLow}</option>
              <option value="name" className="text-gray-900">{t.sortNameAZ}</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <PageLoader />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t.noProductsFound}</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination UI */}
            {totalProducts > itemsPerPage && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                  >
                    {t.previous}
                  </button>
                  
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                    {(() => {
                      const totalPages = Math.ceil(totalProducts / itemsPerPage);
                      const pages: (number | string)[] = [];
                      const showRange = 1;

                      for (let i = 1; i <= totalPages; i++) {
                        if (
                          i === 1 || 
                          i === totalPages || 
                          (i >= currentPage - showRange && i <= currentPage + showRange)
                        ) {
                          pages.push(i);
                        } else if (
                          i === currentPage - showRange - 1 || 
                          i === currentPage + showRange + 1
                        ) {
                          if (!pages.includes('...')) pages.push('...');
                        }
                      }

                      // Deduplicate ellipses
                      const uniquePages = pages.filter((v, i, a) => v !== '...' || a[i-1] !== '...');

                      return uniquePages.map((page, index) => (
                        page === '...' ? (
                          <span key={`dots-${index}`} className="px-2 text-gray-400 font-bold">...</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(Number(page))}
                            className={`min-w-[40px] h-10 px-2 rounded-lg font-bold transition-all flex-shrink-0 ${currentPage === page ? 'bg-gradient-fashion text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}
                          >
                            {page}
                          </button>
                        )
                      ));
                    })()}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalProducts / itemsPerPage), prev + 1))}
                    disabled={currentPage === Math.ceil(totalProducts / itemsPerPage)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                  >
                    {t.next}
                  </button>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {t.showing} {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalProducts)} {t.of} {totalProducts} {t.products_count}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto px-4 py-24 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-[2.5rem] bg-pink-50/50 border border-pink-100 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                      <Award className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">100% Original</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                      Nous ne vendons que des marques authentiques et originales. La qualité est notre priorité absolue.
                  </p>
              </div>

              <div className="text-center p-8 rounded-[2.5rem] bg-purple-50/50 border border-purple-100 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                      <Truck className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Livraison Partout</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                      Où que vous soyez au Maroc, nous vous livrons à domicile dans les plus brefs délais.
                  </p>
              </div>

              <div className="text-center p-8 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Service Premium</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                      Un accompagnement personnalisé via WhatsApp pour répondre à toutes vos envies mode.
                  </p>
              </div>
          </div>
      </div>

      <BrandsSection />
      <InstagramSection />
    </div>
  )
}

import InstagramSection from '@/components/InstagramSection'
import BrandsSection from '@/components/BrandsSection'

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
