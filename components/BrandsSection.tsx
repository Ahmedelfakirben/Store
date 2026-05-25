'use client'

import React from 'react'

export default function BrandsSection() {
    const brands = [
        { name: 'NIKE', font: 'font-sans font-extrabold italic tracking-wider' },
        { name: 'adidas', font: 'font-sans font-bold lowercase' },
        { name: 'PUMA', font: 'font-sans font-black italic tracking-widest' },
        { name: 'ZARA', font: 'font-serif tracking-[0.3em]' },
        { name: 'MANGO', font: 'font-medium tracking-[0.2em]' },
        { name: 'H&M', font: 'font-bold' },
    ];

    // Duplicate brands to create a perfectly seamless loop
    const marqueeBrands = [...brands, ...brands, ...brands, ...brands];

    return (
        <section className="py-16 bg-white border-t border-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Nos Marques Partenaires</h2>
                    <div className="w-20 h-1.5 bg-gradient-fashion mx-auto rounded-full"></div>
                </div>
            </div>

            <div className="relative w-full overflow-hidden py-4 bg-gray-50/50">
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes marquee-horizontal {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee-smooth {
                        animation: marquee-horizontal 25s linear infinite;
                    }
                `}} />

                <div className="flex w-max animate-marquee-smooth gap-16 md:gap-24 items-center">
                    {marqueeBrands.map((brand, idx) => (
                        <div 
                            key={idx} 
                            className="flex items-center justify-center h-16 px-4 flex-shrink-0 transition-transform duration-300 hover:scale-110"
                        >
                            <span className={`text-2xl md:text-3xl text-gray-300 hover:text-gray-900 transition-colors cursor-default select-none ${brand.font}`}>
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Elegant gradient overlays for a premium fading edge effect */}
                <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10"></div>
                <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
            </div>

            <p className="text-center mt-10 text-gray-400 text-sm font-medium italic">
                Uniquement des articles 100% originaux de vos marques préférées
            </p>
        </section>
    )
}
