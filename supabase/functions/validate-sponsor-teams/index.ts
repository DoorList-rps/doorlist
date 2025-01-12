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
    const { sponsor_name, team_members } = await req.json()

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    console.log('Processing team members for sponsor:', sponsor_name)

    const updatedTeamMembers = []

    for (const member of team_members) {
      console.log('Processing team member:', member.name)

      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{
          role: "user",
          content: `Find information about "${member.name}" from ${sponsor_name}:
          1. Their LinkedIn profile URL
          2. Their professional headshot/profile photo URL

          Return a JSON object with these properties (use null for any not found):
          {
            "linkedin_url": "URL of their LinkedIn profile",
            "image_url": "URL of their professional photo"
          }`
        }]
      })

      if (!completion.data.choices[0]?.message?.content) {
        console.log('No response from OpenAI for:', member.name)
        updatedTeamMembers.push(member)
        continue
      }

      try {
        const data = JSON.parse(completion.data.choices[0].message.content)
        console.log('Parsed data for', member.name, ':', data)

        updatedTeamMembers.push({
          ...member,
          linkedin_url: data.linkedin_url || member.linkedin_url,
          image_url: data.image_url || member.image_url
        })
      } catch (error) {
        console.error('Error parsing OpenAI response for', member.name, ':', error)
        updatedTeamMembers.push(member)
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Updating team members for sponsor:', sponsor_name)
    const { error: dbError } = await supabase.rpc(
      'update_sponsor_team_members',
      { 
        p_sponsor_name: sponsor_name,
        p_team_members: updatedTeamMembers
      }
    )

    if (dbError) {
      console.error('Database error updating team members:', dbError)
      throw dbError
    }

    return new Response(JSON.stringify({ success: true, team_members: updatedTeamMembers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in validate-sponsor-teams function:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})