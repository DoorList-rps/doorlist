import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    
    // Initialize OpenAI
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key')
    }

    // Use OpenAI to search for the person's LinkedIn URL
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that finds LinkedIn URLs. Return ONLY the URL, nothing else. If you cannot find a definitive LinkedIn URL, return the current URL that was provided.'
          },
          {
            role: 'user',
            content: `What is the LinkedIn URL for ${name}? They work in real estate investment. If you find multiple matches, focus on someone in real estate or investment management. Their current URL is ${currentUrl || 'not provided'}. Return ONLY the URL, no other text.`
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
      console.log(`No valid LinkedIn URL found for ${name}, keeping current URL: ${currentUrl}`)
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

    const { error } = await supabaseClient.rpc('update_team_member_linkedin', {
      p_name: name,
      p_linkedin_url: linkedinUrl
    })

    if (error) {
      console.error('Error updating LinkedIn URL:', error)
      throw error
    }

    console.log(`Successfully updated LinkedIn URL for ${name}: ${linkedinUrl}`)

    return new Response(
      JSON.stringify({ url: linkedinUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in validate-linkedin function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})