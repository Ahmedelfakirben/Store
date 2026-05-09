'use client'

import React from 'react'


export default function BrandsSection() {
    return (
        <section className="py-20 bg-white border-t border-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Marques Partenaires</h2>
                    <div className="w-24 h-1.5 bg-gradient-fashion mx-auto rounded-full"></div>
                </div>

                <div className="relative group overflow-hidden">
                    {/* Branding Grid */}
                    <div className="flex items-center justify-between gap-8 flex-wrap md:flex-nowrap">
                        {[
                            { name: 'NIKE', font: 'font-black tracking-tighter' },
                            { name: 'adidas', font: 'font-bold lowercase' },
                            { name: 'PUMA', font: 'font-black italic tracking-widest' },
                            { name: 'ZARA', font: 'font-serif tracking-[0.3em]' },
                            { name: 'MANGO', font: 'font-medium tracking-[0.2em]' },
                            { name: 'H&M', font: 'font-bold' },
                        ].map((brand) => (
                            <div 
                                key={brand.name}
                                className="flex-1 min-w-[120px] h-20 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                            >
                                <span className={`text-2xl md:text-3xl text-gray-300 hover:text-gray-900 transition-colors cursor-default ${brand.font}`}>
                                    {brand.name}
                                </span>
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
