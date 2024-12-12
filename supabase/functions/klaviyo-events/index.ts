import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const KLAVIYO_PRIVATE_KEY = Deno.env.get("KLAVIYO_PRIVATE_KEY");
const KLAVIYO_API_URL = "https://a.klaviyo.com/api/v2/track";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KlaviyoEvent {
  event: string;
  customer_properties: {
    $email: string;
    $first_name?: string;
    $last_name?: string;
    phone_number?: string;
  };
  properties: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event, customer_properties, properties }: KlaviyoEvent = await req.json();

    const payload = {
      token: KLAVIYO_PRIVATE_KEY,
      event: event,
      customer_properties: customer_properties,
      properties: properties,
    };

    const response = await fetch(KLAVIYO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Klaviyo API error: ${response.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in Klaviyo event handler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});