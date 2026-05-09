'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, Instagram, Phone, MapPin, MessageCircle } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'

import Image from 'next/image'

export default function Navbar() {
    const { itemCount } = useCart()
    const { t } = useLanguage()
    const { settings } = useSettings()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [mobileMenuOpen])

    // Navigation Links Config
    const navLinks = [
        { href: '/', label: t.shop },
        { href: '/categories', label: t.categories },
        { href: '/about', label: t.whoWeAre },
        { href: '/contact', label: t.contactUs },
    ]

    return (
        <>
            <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Brand / Logo */}
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

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-6">
                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative group p-1"
                            >
                                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-primary-600 transition-colors" strokeWidth={1.5} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Toggle Button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden flex items-center p-1 text-gray-900"
                                aria-label="Open menu"
                            >
                                <Menu className="w-6 h-6" strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu (Full Screen Overlay) */}
            <div 
                className={`fixed inset-0 bg-white z-[10000] transition-all duration-500 ease-in-out md:hidden overflow-y-auto ${
                    mobileMenuOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-full'
                }`}
            >
                {/* Explicit Close Button Inside Menu */}
                <div className="absolute top-6 right-6 z-[10002]">
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 p-1 text-gray-900"
                        aria-label="Close menu"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">Fermer</span>
                        <X className="w-8 h-8" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex flex-col min-h-full pt-28 pb-12 px-8">
                    {/* Nav Links */}
                    <div className="space-y-8 flex-grow">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block text-4xl font-serif text-gray-900 border-b border-gray-100 pb-4 active:text-primary-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Bottom Section (Contact & Socials) */}
                    <div className="mt-12 space-y-10 border-t border-gray-100 pt-10">
                        {/* Contact Details */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex items-center space-x-4 text-gray-800">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                </div>
                                <span className="text-xs font-bold leading-tight">{settings?.address || '📍Avenue aljoulane, Tétouan'}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-gray-800">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                </div>
                                <span className="text-sm font-bold">{settings?.phone || '0712130088'}</span>
                            </div>
                        </div>

                        {/* Social Action Buttons - More subtle design */}
                        <div className="grid grid-cols-2 gap-4">
                            <a 
                                href={`https://wa.me/${settings?.phone?.replace(/\s+/g, '') || '212712130088'}?text=${encodeURIComponent("Bonjour ! J'aimerais avoir plus d'informations.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 py-4 rounded-xl font-bold active:scale-95 transition-all"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm">WhatsApp</span>
                            </a>
                            <a 
                                href={settings?.instagram_link || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 border-2 border-pink-100 bg-pink-50 text-pink-700 py-4 rounded-xl font-bold active:scale-95 transition-all"
                            >
                                <Instagram className="w-5 h-5" />
                                <span className="text-sm">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
