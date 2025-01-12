import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, currentUrl } = await req.json()
    
    // Initialize Perplexity client
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY')
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Missing Perplexity API key')
    }

    // Use Perplexity to search for the person's LinkedIn URL
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that finds LinkedIn URLs. Return ONLY the URL, nothing else.'
          },
          {
            role: 'user',
            content: `What is the LinkedIn URL for ${name}? They work in real estate investment.`
          }
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
    })

    const data = await response.json()
    const linkedinUrl = data.choices[0].message.content.trim()

    // Validate that it's a LinkedIn URL
    if (!linkedinUrl.includes('linkedin.com/in/')) {
      return new Response(
        JSON.stringify({ url: currentUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the sponsor's team member LinkedIn URL in the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Note: This assumes your team_members is stored as JSONB array
    // You'll need to update the specific team member's LinkedIn URL
    // This is a simplified example - you might need to adjust based on your exact data structure
    const { error } = await supabaseClient.rpc('update_team_member_linkedin', {
      p_name: name,
      p_linkedin_url: linkedinUrl
    })

    if (error) throw error

    return new Response(
      JSON.stringify({ url: linkedinUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})