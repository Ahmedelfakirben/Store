'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut, Menu, X, Globe } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'

export default function Navbar() {
    const { user, profile, signOut } = useAuth()
    const { itemCount } = useCart()
    const { t } = useLanguage()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Navigation Links Config
    const navLinks = [
        { href: '/', label: t.shop },
        { href: '/categories', label: t.categories },
        { href: '/contact', label: t.contactUs },
    ]

    return (
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Brand / Logo */}
                    <Link href="/" className="group flex flex-col items-center justify-center">
                        <div className="text-3xl font-serif tracking-widest text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                            LIN
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-primary-400 transition-colors duration-300 -mt-1">
                            Fashion
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

                        {/* Conditional Orders Link */}
                        {user && (
                            <Link
                                href="/orders"
                                className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
                            >
                                {t.myOrders}
                            </Link>
                        )}
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

                        {/* User Menu */}
                        {user ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link
                                    href="/profile"
                                    className="p-1 text-gray-700 hover:text-primary-600 transition-colors"
                                    title={t.myProfile}
                                >
                                    <User className="w-5 h-5" strokeWidth={1.5} />
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    title={t.logout}
                                >
                                    <LogOut className="w-5 h-5" strokeWidth={1.5} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-300 to-accent-300 text-white px-8 py-2.5 rounded-full hover:shadow-lg hover:opacity-90 transition-all duration-300"
                            >
                                {t.login}
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-1 text-gray-700"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-6 border-t border-gray-100 bg-white absolute left-0 right-0 shadow-xl px-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block text-sm font-medium uppercase tracking-widest text-gray-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user && (
                            <Link
                                href="/orders"
                                className="block text-sm font-medium uppercase tracking-widest text-gray-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.myOrders}
                            </Link>
                        )}

                        <div className="pt-4 border-t border-gray-100">
                            {user ? (
                                <div className="space-y-4">
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-2 text-sm text-gray-600 uppercase tracking-wide"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{t.myProfile}</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            signOut()
                                            setMobileMenuOpen(false)
                                        }}
                                        className="flex items-center space-x-2 text-sm text-red-500 uppercase tracking-wide w-full"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{t.logout}</span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="block w-full text-center bg-black text-white px-4 py-3 text-xs font-bold uppercase tracking-widest"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.login}
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
