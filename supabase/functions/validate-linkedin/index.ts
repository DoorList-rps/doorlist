import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name } = await req.json()

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Use GPT to find LinkedIn URL and profile photo URL
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Find the LinkedIn profile URL and profile photo URL for ${name} from Origin Investments. Only return a JSON object with 'url' and 'image_url' properties. If not found, return null for both properties.`
      }]
    })

    const response = completion.data.choices[0].message?.content
    let result = { url: null, image_url: null }
    
    try {
      result = JSON.parse(response || '{"url": null, "image_url": null}')
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update the team member's LinkedIn URL and image URL
    if (result.url || result.image_url) {
      await supabaseClient.rpc('update_team_member_linkedin_and_image', {
        p_name: name,
        p_linkedin_url: result.url,
        p_image_url: result.image_url
      })
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})