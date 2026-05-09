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
                    <div className="relative h-[400px] lg:h-auto bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-1">
                        <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative">
                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
                                        <Instagram className="w-8 h-8 text-gray-300" />
                                    </div>
                                ))}
                            </div>
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-transform">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full p-1 mx-auto mb-4">
                                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
                                            <div className="relative w-full h-full">
                                                <img src="/logo.jpg" alt="Logo" className="object-cover w-full h-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-xl">@shopping__by__lina</h3>
                                    <p className="text-gray-500 text-sm">Vente de marques 100% originales</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="p-12 lg:p-20 flex flex-col justify-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            Explorez notre univers sur Instagram
                        </h2>
                        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                            Suivez-nous pour découvrir nos derniers arrivages, nos looks exclusivos et toute l'actualité de **Shopping by Lina** en temps réel.
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
