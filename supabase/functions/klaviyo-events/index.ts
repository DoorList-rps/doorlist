import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const KLAVIYO_API_KEY = Deno.env.get('KLAVIYO_PRIVATE_KEY')
const KLAVIYO_API_URL = 'https://a.klaviyo.com/api/v2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { event_name, customer_properties, properties } = await req.json()

    if (!event_name || !customer_properties?.email) {
      throw new Error('Missing required parameters')
    }

    const trackData = {
      token: KLAVIYO_API_KEY,
      event: event_name,
      customer_properties: customer_properties,
      properties: properties || {},
      time: Math.floor(Date.now() / 1000)
    }

    const response = await fetch(`${KLAVIYO_API_URL}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trackData)
    })

    if (!response.ok) {
      throw new Error(`Klaviyo API error: ${response.statusText}`)
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error tracking Klaviyo event:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})