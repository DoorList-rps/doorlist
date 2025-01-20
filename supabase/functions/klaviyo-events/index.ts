import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const KLAVIYO_PRIVATE_KEY = Deno.env.get('KLAVIYO_PRIVATE_KEY')

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
    console.log('Received event:', { event_name, customer_properties, properties })

    if (!KLAVIYO_PRIVATE_KEY) {
      throw new Error('KLAVIYO_PRIVATE_KEY is not set')
    }

    const response = await fetch('https://a.klaviyo.com/api/v2/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`
      },
      body: JSON.stringify({
        token: KLAVIYO_PRIVATE_KEY,
        event: event_name,
        customer_properties: customer_properties,
        properties: properties
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Klaviyo API error:', errorData)
      throw new Error(`Klaviyo API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Successfully sent event to Klaviyo:', data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})