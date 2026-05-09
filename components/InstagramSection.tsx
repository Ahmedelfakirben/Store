'use client'

import { Instagram } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export default function InstagramSection() {
    const { settings } = useSettings()

    return (
        <div className="max-w-7xl mx-auto px-4 pb-24">
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Visual Side */}
                    <div className="relative h-[400px] lg:h-auto overflow-hidden">
                        {/* Main Instagram Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"></div>
                        
                        {/* Subtle Mesh Texture */}
                        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                        <div className="relative w-full h-full flex items-center justify-center p-8 lg:p-12">
                            {/* Profile Card Floating */}
                            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl text-center transform hover:scale-105 transition-all duration-500 relative z-10 border border-white/20">
                                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full p-1.5 mx-auto mb-6 shadow-xl">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
                                        <img src="/logo.jpg" alt="Logo" className="object-cover w-full h-full" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 text-2xl mb-1">@shopping__by__lina</h3>
                                <p className="text-gray-500 font-medium">Vente de marques 100% originales</p>
                            </div>

                            {/* Decorative background elements */}
                            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="p-12 lg:p-20 flex flex-col justify-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            Explorez notre univers sur Instagram
                        </h2>
                        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                            Suivez-nous pour découvrir nos derniers arrivages, nos looks exclusivos et toute l'actualité de <span className="font-bold text-gray-900 underline decoration-pink-500/30">Shopping by Lina</span> en temps réel.
                        </p>
                        <a 
                            href={settings?.instagram_link || 'https://www.instagram.com/shopping__by__lina/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                        >
                            <Instagram className="w-6 h-6" />
                            <span>Voir le Profil</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
