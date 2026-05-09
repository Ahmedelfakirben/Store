'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/hooks/useSettings'
import { Mail, Phone, MapPin, Clock, MessageCircle, Instagram } from 'lucide-react'
import InstagramSection from '@/components/InstagramSection'

export default function ContactPage() {
    const { t } = useLanguage()
    const { settings } = useSettings()

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
            {/* Header */}
            <div className="bg-gradient-fashion text-white py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                        Contactez-nous
                    </h1>
                    <p className="text-xl text-white/90">
                        Nous sommes là pour vous aider
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Details Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-primary-100 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 border-gray-100">
                            Nos Coordonnées
                        </h2>

                        <div className="space-y-8">
                            {/* Address */}
                            <div className="flex items-start space-x-5">
                                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-7 h-7 text-primary-600" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Adresse</p>
                                    <p className="text-lg text-gray-800 font-medium leading-relaxed">
                                        {settings?.address || '📍Avenue aljoulane, Tétouan'}
                                    </p>
                                </div>
                            </div>

                            {/* Phone / WhatsApp */}
                            <div className="flex items-start space-x-5">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">WhatsApp</p>
                                    <a 
                                        href={`https://wa.me/${settings?.phone?.replace(/\s+/g, '') || '212712130088'}`} 
                                        className="text-lg text-emerald-600 font-bold hover:underline"
                                    >
                                        {settings?.phone || '0712130088'}
                                    </a>
                                </div>
                            </div>

                            {/* Instagram */}
                            {settings?.instagram_link && (
                                <div className="flex items-start space-x-5">
                                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Instagram className="w-7 h-7 text-pink-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Instagram</p>
                                        <a 
                                            href={settings?.instagram_link || 'https://www.instagram.com/shopping__by__lina/'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg text-gray-800 font-bold hover:text-pink-600 transition-colors"
                                        >
                                            @shopping__by__lina
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Support Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        {/* Decorative accent */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                        
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                            <MessageCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Besoin d'aide ?</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                            Contactez-nous directement sur WhatsApp pour toute question sur nos articles ou vos commandes.
                        </p>
                        
                        <a 
                            href={`https://wa.me/${settings?.phone?.replace(/\s+/g, '') || '212712130088'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                        >
                            <MessageCircle className="w-7 h-7" />
                            <span>Contacter via WhatsApp</span>
                        </a>
                        
                        <div className="mt-8 flex items-center space-x-3 text-gray-400">
                            <Clock className="w-5 h-5" />
                            <span className="text-sm font-medium">Réponse rapide garantie</span>
                        </div>
                    </div>
                </div>
            </div>

            <InstagramSection />
        </div>
    )
}
