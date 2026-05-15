'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/hooks/useSettings'
import Image from 'next/image'

export default function Footer() {
    const { t } = useLanguage()
    const { settings } = useSettings()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative bg-gradient-to-br from-brand-pink via-white to-brand-teal pt-24 pb-12 border-t border-gray-50 overflow-hidden">
            {/* Soft decorative blur circles for a premium feel */}
            <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[50%] bg-white/40 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-white/40 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="group flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-100 group-hover:border-primary-300 transition-all">
                                <Image
                                    src="/logo.jpg"
                                    alt="Shopping by Lina Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-serif tracking-wider text-gray-900 group-hover:text-primary-600 transition-colors">
                                    Shopping by Lina
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 -mt-1">
                                    Fashion Boutique
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-light">
                            Vente des marques Originaux 100%. Votre destination mode pour une élégance intemporelle et des tendances raffinées à Tétouan.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-6">{t.shop}</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-sm text-gray-500 hover:text-black hover:tracking-wide transition-all duration-300">
                                    {t.home}
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-sm text-gray-500 hover:text-black hover:tracking-wide transition-all duration-300">
                                    {t.categories}
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="text-sm text-gray-500 hover:text-black hover:tracking-wide transition-all duration-300">
                                    {t.cart}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-2">
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-6">Contact</h3>
                        <ul className="space-y-4">
                            {settings?.address && (
                                <li className="flex items-start space-x-3 text-gray-500">
                                    <MapPin className="w-5 h-5 mt-0.5 opacity-60" strokeWidth={1.5} />
                                    <span className="text-sm font-light">{settings.address}</span>
                                </li>
                            )}
                            {settings?.phone && (
                                <li className="flex items-start space-x-3 text-gray-500">
                                    <Phone className="w-5 h-5 mt-0.5 opacity-60" strokeWidth={1.5} />
                                    <span className="text-sm font-light">{settings.phone}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-xs text-gray-400 font-light tracking-wide">
                        © {currentYear} {settings?.company_name || 'Shopping by Lina'}. {t.allRightsReserved}.
                    </p>
                    <div className="flex items-center gap-4">
                        {settings?.instagram_link && (
                            <a 
                                href={settings.instagram_link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110 duration-300 shadow-sm"
                                     style={{
                                         background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
                                     }}>
                                    <Instagram className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Síguenos en</span>
                                    <span className="text-sm font-bold text-gray-800 leading-tight">Instagram</span>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
}
