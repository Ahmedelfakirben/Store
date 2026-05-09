'use client'

import { MessageCircle } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export default function WhatsAppButton() {
    const { settings } = useSettings()
    
    if (!settings?.phone) return null

    const whatsappNumber = settings.phone.replace(/\s+/g, '')
    const whatsappUrl = `https://wa.me/${whatsappNumber}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[40] bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-600 transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center space-x-2"
            aria-label="Contact on WhatsApp"
        >
            <MessageCircle className="w-7 h-7" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
                WhatsApp
            </span>
        </a>
    )
}
