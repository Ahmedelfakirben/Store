'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Product, Category } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Search, Award, Truck, ShieldCheck, Shirt, Heart, Star, ShoppingBag } from 'lucide-react'
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
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [sizes, setSizes] = useState<string[]>([])
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

  useEffect(() => {
    fetchSizes()
  }, [selectedCategory])

  async function fetchSizes() {
    let query = supabase
      .from('product_sizes')
      .select('size_name, products!inner(category_id, available)')
      .gt('stock', 0)
      .eq('products.available', true)

    if (selectedCategory) {
      query = query.eq('products.category_id', selectedCategory)
    }

    const { data } = await query

    if (data) {
      const uniqueSizes = Array.from(new Set(data.map(s => s.size_name)))
        .sort((a, b) => {
          const aNum = parseFloat(a)
          const bNum = parseFloat(b)
          if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum

          const sizeOrder = ['XXS', 'XS', 'XS/S', 'S', 'S/M', 'M', 'M/L', 'L', 'L/XL', 'XL', 'XXL', 'XXXL', '3XL', '4XL', '5XL']
          const aIndex = sizeOrder.indexOf(a.toUpperCase())
          const bIndex = sizeOrder.indexOf(b.toUpperCase())

          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
          if (aIndex !== -1) return -1
          if (bIndex !== -1) return 1

          return a.localeCompare(b)
        })

      setSizes(uniqueSizes)

      // If selected size is not in the new list, reset it
      if (selectedSize && !uniqueSizes.includes(selectedSize)) {
        setSelectedSize('')
      }
    }
  }

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
      .select(selectedSize ? '*, product_sizes!inner(*)' : '*, product_sizes(*)', { count: 'exact' })
      .eq('available', true)
      .gt('stock', 0)
      .gt('base_price', 0)
      .not('image_url', 'is', null)
      .neq('image_url', '')

    if (selectedSize) {
      query = query.eq('product_sizes.size_name', selectedSize)
    }

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

    if (data) {
      const availableProducts = (data as Product[]).filter(product => {
        if (product.product_sizes && product.product_sizes.length > 0) {
          return product.product_sizes.some(s => s.stock > 0)
        }
        return (product.stock ?? 0) > 0
      })
      setProducts(availableProducts)
    }
    if (count !== null) setTotalProducts(count)
    setLoading(false)
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchProducts(1)
  }, [searchTerm, selectedCategory, selectedSize, sortBy])

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-pink via-white to-brand-teal relative overflow-hidden">
      {/* Soft ambient blur shapes for a luxury atmosphere */}
      <div className="absolute top-[15%] left-[-15%] w-[60vw] h-[60vw] max-w-[650px] bg-gradient-to-tr from-primary-200/20 to-accent-200/25 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[55%] right-[-15%] w-[50vw] h-[50vw] max-w-[550px] bg-gradient-to-br from-brand-teal/25 to-primary-100/20 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Hero Section with Parallax Effect */}
      <div
        className="relative min-h-[95vh] flex items-center md:items-end pl-4 pr-4 sm:pl-6 sm:pr-6 md:pl-6 lg:pl-10 md:pr-16 pt-24 pb-20 md:pb-40 overflow-hidden"
      >
        {/* Parallax Background Layer */}
        <div 
          className="absolute inset-0 z-0 hero-bg-custom"
          style={{
            transform: 'translateZ(0)',
          }}
        ></div>

        {/* Content Overlay */}
        <div className="max-w-7xl mx-auto md:mx-0 md:ml-0 md:mr-auto w-full relative z-50 flex flex-col items-center md:items-start select-none pt-12 md:pt-0">
          
          {/* Centered column in reference to the main title ARTICLES SPORT */}
          <div className="w-full max-w-[50rem] flex flex-col items-center text-center">
            {/* Subtitle */}
            <span className="text-white text-base sm:text-lg md:text-2xl tracking-[0.25em] md:tracking-[0.4em] font-semibold uppercase mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              LES MEILLEURS
            </span>
            
            {/* Main Title */}
            <h1 className="text-white text-4xl sm:text-6xl md:text-[5.5rem] font-black tracking-tight leading-none mb-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              ARTICLES <span className="text-[#f1a4b1] drop-shadow-[0_0_15px_rgba(241,164,177,0.4)]">SPORT</span>
            </h1>

            {/* Script Text */}
            <div className="font-cursive text-white text-5xl sm:text-6xl md:text-[5.5rem] leading-none mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] animate-pulse">
              pour Filles
            </div>

            {/* Brand Names Row (Centered in reference to the title above) */}
            <div className="w-full max-w-[340px] sm:max-w-xl flex justify-center items-center gap-4 sm:gap-8 md:gap-10 text-white mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              {/* Nike Name */}
              <span className="text-white font-sans font-extrabold italic text-base sm:text-xl md:text-2xl tracking-wider hover:text-gray-200 transition-colors cursor-pointer">NIKE</span>

              {/* Separator */}
              <div className="h-5 sm:h-7 md:h-8 w-[1.5px] bg-white/40"></div>

              {/* Adidas Name */}
              <span className="text-white font-sans font-bold text-base sm:text-xl md:text-2xl tracking-tight hover:text-gray-200 transition-colors cursor-pointer">adidas</span>

              {/* Separator */}
              <div className="h-5 sm:h-7 md:h-8 w-[1.5px] bg-white/40"></div>

              {/* Puma Name */}
              <span className="text-white font-sans font-black text-base sm:text-xl md:text-2xl tracking-widest hover:text-gray-200 transition-colors cursor-pointer">PUMA</span>
            </div>

            {/* Value line with spacing */}
            <div className="w-full max-w-[280px] sm:max-w-md h-[1px] bg-white/30 mb-4"></div>
            
            <div className="w-full max-w-[280px] sm:max-w-md text-center text-white text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] font-semibold mb-10 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Style &nbsp;|&nbsp; Qualité &nbsp;|&nbsp; Performance
            </div>

            {/* Shop Now Button Wrapper for Perfect Centering under Titles */}
            <div className="w-full max-w-[280px] sm:max-w-md flex justify-center">
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary-600 px-12 py-5 rounded-full font-black text-lg hover:bg-gray-50 transition-all shadow-[0_15px_35px_rgba(236,72,153,0.25)] hover:shadow-[0_20px_45px_rgba(236,72,153,0.45)] hover:scale-105 transform hover:-translate-y-1.5 active:scale-95 duration-300"
              >
                {t.shopNow}
              </button>
            </div>

            {/* Bottom Features Row - Centered in reference to the button */}
            <div className="w-full max-w-[280px] sm:max-w-md flex justify-around items-center mt-12 md:mt-16 text-white select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {/* Nouveautés */}
              <button 
                onClick={() => {
                  setSortBy('newest');
                  setSelectedCategory('');
                  setSelectedSize('');
                  setSearchTerm('');
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-1.5 hover:scale-110 active:scale-95 transition-all duration-250 cursor-pointer focus:outline-none bg-transparent border-none"
              >
                <Shirt className="w-7 h-7 text-white stroke-[1.25]" />
                <span className="text-[9px] text-white/95 tracking-[0.1em] uppercase font-bold">Nouveautés</span>
              </button>

              {/* Confort */}
              <button 
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSize('');
                  setSearchTerm('');
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-1.5 hover:scale-110 active:scale-95 transition-all duration-250 cursor-pointer focus:outline-none bg-transparent border-none"
              >
                <Heart className="w-7 h-7 text-white stroke-[1.25]" />
                <span className="text-[9px] text-white/95 tracking-[0.1em] uppercase font-bold">Confort</span>
              </button>

              {/* Tendances */}
              <button 
                onClick={() => {
                  setSortBy('newest');
                  setSelectedCategory('');
                  setSelectedSize('');
                  setSearchTerm('');
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-1.5 hover:scale-110 active:scale-95 transition-all duration-250 cursor-pointer focus:outline-none bg-transparent border-none"
              >
                <Star className="w-7 h-7 text-white stroke-[1.25]" />
                <span className="text-[9px] text-white/95 tracking-[0.1em] uppercase font-bold">Tendances</span>
              </button>

              {/* Disponible Maintenant */}
              <button 
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSize('');
                  setSearchTerm('');
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-1.5 hover:scale-110 active:scale-95 transition-all duration-250 cursor-pointer text-center focus:outline-none bg-transparent border-none"
              >
                <ShoppingBag className="w-7 h-7 text-white stroke-[1.25]" />
                <span className="text-[9px] text-white/95 tracking-[0.05em] uppercase font-bold leading-none">Disponible<br/>Maintenant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal transition fade to brand color */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-30 bg-gradient-to-t from-brand-pink to-transparent"></div>

        {/* Decorative Slanted Edge for a modern look */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 z-40 bg-brand-pink" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </div>

      {/* Search and Filters */}
      <div id="products" className="max-w-7xl mx-auto px-4 py-8">
        <style dangerouslySetInnerHTML={{ __html: `
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}} />

        {/* Category Bubbles Slider */}
        <div className="mb-6 select-none">
          <div className="flex items-center space-x-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 border flex-shrink-0 whitespace-nowrap focus:outline-none ${
                selectedCategory === ''
                  ? 'bg-gradient-fashion text-white border-transparent shadow-[0_8px_25px_rgba(236,72,153,0.35)] scale-105'
                  : 'bg-white/80 text-gray-600 border-gray-200/60 hover:bg-white hover:text-gray-950 backdrop-blur-md'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 border flex-shrink-0 whitespace-nowrap focus:outline-none ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-fashion text-white border-transparent shadow-[0_8px_25px_rgba(236,72,153,0.35)] scale-105'
                    : 'bg-white/80 text-gray-600 border-gray-200/60 hover:bg-white hover:text-gray-950 backdrop-blur-md'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Glassmorphic Search & Filters Bar */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl p-6 mb-8 border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/80 text-gray-900 font-medium"
              />
            </div>

            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-4 py-3 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 font-medium bg-white/80"
            >
              <option value="" className="text-gray-900">{t.allSizes}</option>
              {sizes.map((size) => (
                <option key={size} value={size} className="text-gray-900">
                  {size}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 font-medium bg-white/80"
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
                      const uniquePages = pages.filter((v, i, a) => v !== '...' || a[i - 1] !== '...');

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
      <div
        className="relative px-4 py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/bottom-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/25"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-[2.5rem] bg-white/15 border border-white/30 transition-all hover:shadow-xl hover:-translate-y-1 backdrop-blur-md">
              <div className="w-16 h-16 bg-white/20 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Original</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Nous ne vendons que des marques authentiques et originales. La qualité est notre priorité absolue.
              </p>
            </div>

            <div className="text-center p-8 rounded-[2.5rem] bg-white/15 border border-white/30 transition-all hover:shadow-xl hover:-translate-y-1 backdrop-blur-md">
              <div className="w-16 h-16 bg-white/20 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Livraison Partout</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Où que vous soyez au Maroc, nous vous livrons à domicile dans les plus brefs délais.
              </p>
            </div>

            <div className="text-center p-8 rounded-[2.5rem] bg-white/15 border border-white/30 transition-all hover:shadow-xl hover:-translate-y-1 backdrop-blur-md">
              <div className="w-16 h-16 bg-white/20 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Service Premium</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Un accompagnement personnalisé via WhatsApp pour répondre à toutes vos envies mode.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <BrandsSection />
        <InstagramSection />
      </div>
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
