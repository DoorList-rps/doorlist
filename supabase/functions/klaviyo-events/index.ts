
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const KLAVIYO_PRIVATE_KEY = Deno.env.get('KLAVIYO_PRIVATE_KEY')
const ZAPIER_WEBHOOK_URL = Deno.env.get('ZAPIER_WEBHOOK_URL')

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
    console.log('Received event data:', { event_name, customer_properties, properties })

    if (!KLAVIYO_PRIVATE_KEY) {
      console.warn('KLAVIYO_PRIVATE_KEY is not set, only sending to Zapier webhook if configured')
    }

    // Create a proper profile object for Klaviyo API V3
    const profile = {
      type: "profile",
      attributes: {
        email: customer_properties.email,
        first_name: customer_properties.first_name,
        last_name: customer_properties.last_name,
        phone_number: customer_properties.phone_number,
        properties: {
          is_accredited_investor: customer_properties.is_accredited_investor || false
        }
      }
    }

    console.log('Formatted profile data:', JSON.stringify(profile))

    // Track responses for diagnostics
    const responses = {
      klaviyo: null,
      zapier: null
    }

    // Try sending to Klaviyo if the API key is available
    if (KLAVIYO_PRIVATE_KEY) {
      try {
        console.log('Attempting to send event to Klaviyo API...')
        // Using Klaviyo's V3 API endpoint for tracking events
        const klaviyoResponse = await fetch('https://a.klaviyo.com/api/events/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
            'revision': '2023-02-22'
          },
          body: JSON.stringify({
            data: {
              type: "event",
              attributes: {
                profile: profile,
                metric: {
                  name: event_name
                },
                properties: properties || {},
                time: new Date().toISOString()
              }
            }
          })
        })

        console.log('Klaviyo API response status:', klaviyoResponse.status)
        
        // Log complete response headers for debugging
        const responseHeaders = {};
        klaviyoResponse.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        console.log('Klaviyo API response headers:', responseHeaders);
        
        const responseText = await klaviyoResponse.text()
        console.log('Klaviyo API response body:', responseText)

        responses.klaviyo = {
          status: klaviyoResponse.status,
          body: responseText
        }

        if (!klaviyoResponse.ok) {
          console.error(`Klaviyo API error: ${klaviyoResponse.status} ${klaviyoResponse.statusText} - ${responseText}`)
        } else {
          console.log('Successfully sent event to Klaviyo')
        }
      } catch (klaviyoError) {
        console.error('Error sending to Klaviyo:', klaviyoError)
        responses.klaviyo = {
          error: klaviyoError.message
        }
      }
    }

    // Try sending to Zapier webhook if the URL is configured
    if (ZAPIER_WEBHOOK_URL) {
      try {
        console.log('Sending event to Zapier webhook...')
        
        // Format the data for Zapier
        const zapierData = {
          event_name,
          customer: customer_properties,
          properties: properties || {},
          timestamp: new Date().toISOString()
        }
        
        const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(zapierData)
        })
        
        const zapierResponseText = await zapierResponse.text()
        console.log('Zapier webhook response status:', zapierResponse.status)
        console.log('Zapier webhook response:', zapierResponseText)
        
        responses.zapier = {
          status: zapierResponse.status,
          body: zapierResponseText
        }
        
        if (!zapierResponse.ok) {
          console.error(`Zapier webhook error: ${zapierResponse.status} ${zapierResponse.statusText} - ${zapierResponseText}`)
        } else {
          console.log('Successfully sent event to Zapier webhook')
        }
      } catch (zapierError) {
        console.error('Error sending to Zapier webhook:', zapierError)
        responses.zapier = {
          error: zapierError.message
        }
      }
    } else {
      console.warn('ZAPIER_WEBHOOK_URL is not set, skipping webhook integration')
    }

    // Determine overall success status
    const success = (KLAVIYO_PRIVATE_KEY && responses.klaviyo && !responses.klaviyo.error) || 
                    (ZAPIER_WEBHOOK_URL && responses.zapier && !responses.zapier.error)

    // Prepare the response
    const responseData = {
      success,
      message: success ? 'Event successfully sent' : 'Failed to send event to all destinations',
      details: responses
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: success ? 200 : 500,
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
