'use client'

import React from 'react'

const BRANDS = [
    { name: 'Nike', logo: 'https://www.vectorlogo.zone/logos/nike/nike-ar21.svg' },
    { name: 'Adidas', logo: 'https://www.vectorlogo.zone/logos/adidas/adidas-ar21.svg' },
    { name: 'Puma', logo: 'https://www.vectorlogo.zone/logos/puma/puma-ar21.svg' },
    { name: 'Zara', logo: 'https://www.vectorlogo.zone/logos/zara/zara-ar21.svg' },
    { name: 'Mango', logo: 'https://www.vectorlogo.zone/logos/mango/mango-ar21.svg' },
    { name: 'H&M', logo: 'https://www.vectorlogo.zone/logos/hm/hm-ar21.svg' },
]

export default function BrandsSection() {
    return (
        <section className="py-20 bg-white border-t border-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Marques Partenaires</h2>
                    <div className="w-24 h-1.5 bg-gradient-fashion mx-auto rounded-full"></div>
                </div>

                <div className="relative group overflow-hidden">
                    {/* Scrolling Container */}
                    <div className="flex items-center justify-between gap-12 flex-wrap md:flex-nowrap opacity-60 hover:opacity-100 transition-opacity duration-500">
                        {BRANDS.map((brand) => (
                            <div 
                                key={brand.name}
                                className="flex-1 min-w-[120px] h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110"
                            >
                                <img 
                                    src={brand.logo} 
                                    alt={brand.name}
                                    className="max-h-12 w-auto object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Decorative Blurs */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none hidden md:block"></div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none hidden md:block"></div>
                </div>
                
                <p className="text-center mt-12 text-gray-400 text-sm font-medium italic">
                    Uniquement des articles 100% originaux de vos marques préférées
                </p>
            </div>
        </section>
    )
}
