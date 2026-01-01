'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="group inline-block">
                            <div className="text-3xl font-serif tracking-widest text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                                LIN
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-primary-400 transition-colors duration-300 -mt-1">
                                Fashion
                            </div>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-light">
                            Votre destination mode pour une élégance intemporelle et des tendances raffinées.
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

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-6">Service Client</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/orders" className="text-sm text-gray-500 hover:text-black hover:tracking-wide transition-all duration-300">
                                    {t.myOrders}
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-sm text-gray-500 hover:text-black hover:tracking-wide transition-all duration-300">
                                    {t.myProfile}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-500 hover:text-black hover:tracking-wide transition-all duration-300">
                                    {t.contactUs}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-500 hover:text-black transition-colors">
                                <Mail className="w-5 h-5 mt-0.5 opacity-60" strokeWidth={1.5} />
                                <span className="text-sm font-light">contact@lin-fashion.com</span>
                            </li>
                            <li className="flex items-start space-x-3 text-gray-500 hover:text-black transition-colors">
                                <Phone className="w-5 h-5 mt-0.5 opacity-60" strokeWidth={1.5} />
                                <span className="text-sm font-light">+212 600 000 000</span>
                            </li>
                            <li className="flex items-start space-x-3 text-gray-500 hover:text-black transition-colors">
                                <MapPin className="w-5 h-5 mt-0.5 opacity-60" strokeWidth={1.5} />
                                <span className="text-sm font-light">Casablanca, Maroc</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-xs text-gray-400 font-light tracking-wide">
                        © {currentYear} LIN Fashion. {t.allRightsReserved}.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors transform hover:-translate-y-1 duration-300">
                            <Facebook className="w-5 h-5" strokeWidth={1.5} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors transform hover:-translate-y-1 duration-300">
                            <Instagram className="w-5 h-5" strokeWidth={1.5} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors transform hover:-translate-y-1 duration-300">
                            <Twitter className="w-5 h-5" strokeWidth={1.5} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
