import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface OrderRecord {
    id: string
    created_at: string
    total: number
    status: string
    shipping_address: string
    phone: string
    customer_id: string
    email?: string
}

interface WebhookPayload {
    type: 'INSERT' | 'UPDATE'
    table: string
    record: OrderRecord
    old_record: OrderRecord
    schema: string
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: WebhookPayload = await req.json()
        console.log('Webhook received:', payload)

        if (!RESEND_API_KEY) {
            throw new Error('Missing RESEND_API_KEY')
        }

        const { record, type, old_record } = payload

        // Create Supabase Client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2")
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Fetch Customer Email
        const { data: customer, error: customerError } = await supabase
            .from('customer_profiles')
            .select('email, full_name')
            .eq('id', record.customer_id)
            .single()

        if (customerError || !customer || !customer.email) {
            console.error('Could not fetch customer email:', customerError)
            return new Response(JSON.stringify({ error: 'Customer not found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        const customerEmail = customer.email
        const customerName = customer.full_name || 'Client'

        let subject = ''
        let html = ''
        let shouldSend = false

        // Professional Email Template Helper
        const getEmailTemplate = (title: string, content: string, actionUrl?: string, actionText?: string) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
            .content { padding: 40px 30px; }
            .order-details { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
            .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .detail-label { color: #6b7280; font-size: 14px; }
            .detail-value { font-weight: 600; color: #111827; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; margin-top: 20px; box-shadow: 0 4px 10px rgba(236, 72, 153, 0.3); }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
            .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
            .status-pending { background-color: #fef3c7; color: #d97706; }
            .status-shipped { background-color: #ede9fe; color: #7c3aed; }
            .status-delivered { background-color: #d1fae5; color: #059669; }
            .status-cancelled { background-color: #fee2e2; color: #dc2626; }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                <h1>CLOTHING STORE</h1>
            </div>
            <div class="content">
                <h2 style="color: #111827; margin-top: 0;">${title}</h2>
                ${content}
                ${actionUrl ? `<div style="text-align: center;"><a href="${actionUrl}" class="button">${actionText}</a></div>` : ''}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Clothing Store. Tous droits réservés.</p>
                <p>Casablanca, Maroc • +212 600 000 000</p>
            </div>
            </div>
        </body>
        </html>
        `

        // Logic for INSERT (New Order)
        if (type === 'INSERT') {
            shouldSend = true
            subject = `Confirmation de commande #${record.id.slice(0, 8)} - Clothing Store`

            const content = `
                <p>Bonjour <strong>${customerName}</strong>,</p>
                <p>Merci pour votre confiance ! Nous avons bien reçu votre commande et nous la préparons avec soin.</p>
                
                <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Numéro de commande</span>
                    <span class="detail-value">#${record.id.slice(0, 8)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">${new Date(record.created_at).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total</span>
                    <span class="detail-value" style="color: #ec4899;">${record.total.toFixed(2)} DH</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Adresse de livraison</span>
                    <span class="detail-value" style="text-align: right; max-width: 60%;">${record.shipping_address}</span>
                </div>
                </div>
                
                <p>Vous recevrez un nouvel e-mail dès que votre commande sera expédiée.</p>
            `

            html = getEmailTemplate('Commande Confirmée ! 🎉', content, 'https://clothing-store-shop.vercel.app/profile', 'Suivre ma commande')
        }

        // Logic for UPDATE (Status Change)
        if (type === 'UPDATE' && record.status !== old_record.status) {
            shouldSend = true
            subject = `Mise à jour commande #${record.id.slice(0, 8)} - Clothing Store`

            const statusMessages: Record<string, string> = {
                'preparing': 'Votre commande est en cours de préparation.',
                'shipped': 'Votre commande a été expédiée ! 🚚',
                'delivered': 'Votre commande a été livrée. Merci ! ✨',
                'cancelled': 'Votre commande a été annulée.',
                'ready': 'Votre commande est prête.'
            }

            const badgeColors: Record<string, string> = {
                'pending': 'status-pending',
                'shipped': 'status-shipped',
                'delivered': 'status-delivered',
                'cancelled': 'status-cancelled'
            }

            const statusMsg = statusMessages[record.status] || `Nouveau statut : ${record.status}`
            const badgeClass = badgeColors[record.status] || 'status-pending'

            const content = `
                <p>Bonjour <strong>${customerName}</strong>,</p>
                <p>Il y a du nouveau concernant votre commande <strong>#${record.id.slice(0, 8)}</strong>.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                <span class="status-badge ${badgeClass}" style="transform: scale(1.2);">${record.status.toUpperCase()}</span>
                </div>

                <p style="text-align: center; font-size: 16px;">${statusMsg}</p>
                
                <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Total</span>
                    <span class="detail-value">${record.total.toFixed(2)} DH</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Adresse</span>
                    <span class="detail-value" style="text-align: right; max-width: 60%;">${record.shipping_address}</span>
                </div>
                </div>
            `

            html = getEmailTemplate('Mise à jour de statut 📦', content, 'https://clothing-store-shop.vercel.app/profile', 'Voir les détails')
        }

        if (shouldSend) {
            console.log(`Sending email to ${customerEmail} with subject: ${subject}`)

            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'Clothing Store <onboarding@resend.dev>', // Default Resend test domain
                    to: customerEmail, // NOTE: In Resend free tier, you can only send to your own authenticated email unless you verify a domain.
                    subject: subject,
                    html: html,
                }),
            })

            const data = await res.json()
            console.log('Resend API response:', data)

            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        return new Response(JSON.stringify({ message: 'No email needed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
