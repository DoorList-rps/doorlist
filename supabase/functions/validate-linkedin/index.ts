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

    // Use a more specific prompt for Origin Investments' deals
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Find information about "${name}" from Origin Investments:

        If this appears to be a past real estate deal or property:
        1. Find a high-quality photo of the property
        2. The property's website or listing page
        3. Detailed location information
        4. Brief description of the deal

        If this appears to be a team member:
        1. Their LinkedIn profile URL
        2. Their professional headshot/profile photo

        Return a JSON object with these properties (use null for any not found):
        {
          "type": "deal" or "person",
          "url": LinkedIn URL for people, website URL for deals,
          "image_url": profile photo URL or property photo URL,
          "location": full location details for deals,
          "description": deal description if applicable
        }`
      }]
    })

    const response = completion.data.choices[0].message.content
    console.log('OpenAI Response:', response)

    try {
      const data = JSON.parse(response)
      
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      if (data.type === 'deal') {
        const { error: dbError } = await supabase.rpc(
          'update_past_deal_info',
          { 
            p_name: name,
            p_website_url: data.url,
            p_image_url: data.image_url,
            p_location: data.location
          }
        )

        if (dbError) {
          console.error('Database error updating deal:', dbError)
          throw dbError
        }
      } else if (data.type === 'person' && data.url) {
        const { error: dbError } = await supabase.rpc(
          'update_team_member_linkedin_and_image',
          { 
            p_name: name,
            p_linkedin_url: data.url,
            p_image_url: data.image_url
          }
        )

        if (dbError) {
          console.error('Database error updating team member:', dbError)
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