'use client'

import React from 'react'

export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-100/50 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative flex flex-col items-center">
                {/* Logo Container with rotating ring */}
                <div className="relative w-32 h-32 mb-8">
                    {/* Outer rotating gradient ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-accent-500 animate-spin"></div>
                    
                    {/* Inner pulsing ring */}
                    <div className="absolute inset-2 rounded-full border-2 border-gray-100 animate-pulse"></div>
                    
                    {/* Logo */}
                    <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white transform hover:scale-110 transition-transform duration-500">
                        <img 
                            src="/logo.jpg" 
                            alt="Shopping by Lina" 
                            className="w-full h-full object-cover animate-pulse"
                        />
                    </div>
                </div>

                {/* Text animation */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2 tracking-tight">
                        Shopping by Lina
                    </h2>
                    <div className="flex items-center justify-center space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>

            {/* Premium quote/motto at bottom */}
            <div className="absolute bottom-12 text-gray-400 text-sm font-medium tracking-[0.2em] uppercase">
                Fashion Boutique
            </div>
        </div>
    )
}
