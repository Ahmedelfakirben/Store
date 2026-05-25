'use client'

import { MessageCircle } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export default function WhatsAppButton() {
    const { settings } = useSettings()
    
    if (!settings?.phone) return null

    let cleanedPhone = settings.phone.replace(/\s+/g, '').replace(/^\+/, '')
    if (cleanedPhone.startsWith('0')) {
        cleanedPhone = '212' + cleanedPhone.substring(1)
    } else if (!cleanedPhone.startsWith('212')) {
        cleanedPhone = '212' + cleanedPhone
    }

    const defaultMessage = encodeURIComponent("Bonjour ! J'aimerais avoir plus d'informations sur vos produits.")
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${defaultMessage}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[40] bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(16,185,129,0.4)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.7)] transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center space-x-2 border border-emerald-400/20"
            aria-label="Contact on WhatsApp"
        >
            {/* Glowing ring animation */}
            <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping pointer-events-none group-hover:duration-700"></span>
            
            <MessageCircle className="w-7 h-7 relative z-10 animate-bounce-slow" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold relative z-10">
                WhatsApp
            </span>
        </a>
    )
}
