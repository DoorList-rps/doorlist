import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, currentUrl } = await req.json();
    
    // Initialize OpenAI
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key');
    }

    console.log(`Processing LinkedIn URL for ${name}. Current URL: ${currentUrl}`);

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
            content: 'You are a helpful assistant that finds LinkedIn profile URLs. You should return ONLY the LinkedIn profile URL in the format https://www.linkedin.com/in/username. If you cannot find a definitive LinkedIn URL or if the current URL seems correct, return the current URL. Do not include any other text in your response.'
          },
          {
            role: 'user',
            content: `Find the LinkedIn URL for ${name} who works in real estate investment or private equity. Their current LinkedIn URL is ${currentUrl || 'not provided'}. Return ONLY the URL, no other text. If you can't find a definitive match, return the current URL.`
          }
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const linkedinUrl = data.choices[0].message.content.trim();
    
    console.log(`OpenAI suggested URL for ${name}: ${linkedinUrl}`);

    // Only proceed if we got a different URL
    if (linkedinUrl !== currentUrl) {
      // Initialize Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Update the LinkedIn URL in the database
      const { error } = await supabaseClient.rpc('update_team_member_linkedin', {
        p_name: name,
        p_linkedin_url: linkedinUrl
      });

      if (error) {
        console.error('Error updating LinkedIn URL:', error);
        throw error;
      }

      console.log(`Successfully updated LinkedIn URL for ${name} to ${linkedinUrl}`);
    } else {
      console.log(`No update needed for ${name}, keeping current URL: ${currentUrl}`);
    }

    return new Response(
      JSON.stringify({ url: linkedinUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in validate-linkedin function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});