'use client'

import { ShieldCheck, Truck, Award, Star, Globe, Heart } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
                {/* Modern Gradient Mesh Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/30 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 animate-fade-in">
                        Qui Sommes Nous
                    </h1>
                    <div className="w-24 h-1 bg-gradient-fashion mx-auto mb-8"></div>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light tracking-wide">
                        L'excellence de la mode internationale, livrée directement chez vous.
                    </p>
                </div>
            </div>

            {/* Core Values / Mission */}
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center p-8 rounded-[2rem] bg-primary-50 border border-primary-100 transition-transform hover:-translate-y-2">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                            <Award className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Original</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Nous ne vendons que des marques authentiques et originales. La qualité est notre priorité absolue.
                        </p>
                    </div>

                    <div className="text-center p-8 rounded-[2rem] bg-accent-50 border border-accent-100 transition-transform hover:-translate-y-2">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                            <Truck className="w-8 h-8 text-accent-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Livraison Partout</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Où que vous soyez au Maroc, nous vous livrons à domicile dans les plus brefs délais.
                        </p>
                    </div>

                    <div className="text-center p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 transition-transform hover:-translate-y-2">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Service Premium</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Un accompagnement personnalisé via WhatsApp pour répondre à toutes vos envies mode.
                        </p>
                    </div>
                </div>
            </div>

            {/* Morocco Delivery Section */}
            <div className="bg-gray-50 py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-primary-600 font-bold uppercase tracking-[0.2em] mb-4 block">Expédition Nationale</span>
                            <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                Le Maroc est notre terrain de jeu
                            </h2>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                                De Tanger à Dakhla, en passant par Casablanca, Marrakech et Fès. Nous avons tissé un réseau logistique performant pour que la mode n'ait plus de frontières.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-gray-900 font-bold">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span>Livraison Rapide (24h-48h)</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-900 font-bold">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span>Paiement à la livraison disponible</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-900 font-bold">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span>Suivi de commande personnalisé</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl bg-white border-8 border-primary-50 flex items-center justify-center p-12">
                            <img 
                                src="/logo.jpg" 
                                alt="Shopping by Lina Logo" 
                                className="max-w-full max-h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-12 pointer-events-none">
                                <p className="text-white text-3xl font-serif italic">"La mode de classe mondiale, accessible partout au Royaume."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brands Section */}
            <div className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Marques Partenaires</h2>
                    <p className="text-gray-500 text-lg">Seulement le meilleur pour nos clients.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {['Nike', 'Adidas', 'Zara', 'Gucci', 'Prada', 'Dior', 'Chanel', 'Lacoste', 'Puma', 'Guess', 'Vans', 'Calvin Klein'].map((brand) => (
                        <div key={brand} className="h-32 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 hover:border-primary-200 hover:bg-white hover:shadow-xl transition-all group">
                            <span className="text-xl font-serif text-gray-400 group-hover:text-primary-600 transition-colors uppercase tracking-widest">{brand}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-fashion py-24 text-center px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Prêt à transformer votre style ?</h2>
                <a 
                    href="/" 
                    className="inline-block bg-white text-primary-600 px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform"
                >
                    Découvrir la Collection
                </a>
            </div>
        </div>
    )
}
