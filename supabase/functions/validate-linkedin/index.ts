import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name } = await req.json()

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Use GPT to find LinkedIn URL and profile photo URL with more specific prompt
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Find information about ${name} from Origin Investments:
        1. Their LinkedIn profile URL
        2. Their profile photo URL
        3. If this is a past deal rather than a person, find:
           - A high-quality photo of the property
           - The property's website
           - Location details
        
        Return a JSON object with 'url', 'image_url', 'website_url' (for deals), and 'location' (for deals) properties. 
        If any property is not found, return null for that property.`
      }]
    })

    const response = completion.data.choices[0].message.content
    console.log('OpenAI Response:', response)

    try {
      const data = JSON.parse(response)
      
      // If this is a team member (has LinkedIn URL)
      if (data.url) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error: dbError } = await supabase.rpc(
          'update_team_member_linkedin_and_image',
          { 
            p_name: name,
            p_linkedin_url: data.url,
            p_image_url: data.image_url
          }
        )

        if (dbError) {
          console.error('Database error:', dbError)
          throw dbError
        }
      }
      // If this is a past deal (has website URL)
      else if (data.website_url) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Update past deal information
        const { error: dbError } = await supabase.rpc(
          'update_past_deal_info',
          { 
            p_name: name,
            p_website_url: data.website_url,
            p_image_url: data.image_url,
            p_location: data.location
          }
        )

        if (dbError) {
          console.error('Database error:', dbError)
          throw dbError
        }
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in validate-linkedin function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})