'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, CompanySettings } from '@/lib/supabase'

interface SettingsContextType {
    settings: CompanySettings | null
    loading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<CompanySettings | null>({
        id: 'default',
        company_name: 'Shopping by Lina',
        address: 'Avenue aljoulane, Tétouan',
        phone: '0712130088',
        instagram_link: 'https://www.instagram.com/shopping__by__lina/'
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('company_settings')
                    .select('*')
                    .single()

                if (!error && data) {
                    setSettings(data)
                }
            } catch (err) {
                console.error('Error fetching settings:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}
