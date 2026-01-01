'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('Error during auth callback:', error)
                router.push('/auth/login?error=auth_failed')
                return
            }

            if (session?.user) {
                // Check if customer profile exists
                const { data: profile } = await supabase
                    .from('customer_profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                // Create profile if it doesn't exist (for OAuth users)
                if (!profile) {
                    await supabase
                        .from('customer_profiles')
                        .insert({
                            id: session.user.id,
                            email: session.user.email!,
                            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                        })
                }

                router.push('/')
            } else {
                router.push('/auth/login')
            }
        }

        handleCallback()
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Connexion en cours...</p>
            </div>
        </div>
    )
}
