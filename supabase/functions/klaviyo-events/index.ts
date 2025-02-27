
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

    // Using the current Klaviyo API (V3)
    const response = await fetch('https://a.klaviyo.com/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            metric: {
              name: event_name
            },
            profile: {
              email: customer_properties.$email
            },
            properties: properties
          }
        }
      })
    })

    const responseText = await response.text()
    console.log('Klaviyo API response status:', response.status)
    console.log('Klaviyo API response body:', responseText)

    if (!response.ok) {
      throw new Error(`Klaviyo API error: ${response.status} ${response.statusText} - ${responseText}`)
    }

    // Parse the response only if it's JSON
    let data
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      console.log('Response was not JSON, but request was successful')
      data = { success: true }
    }

    console.log('Successfully sent event to Klaviyo')

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
