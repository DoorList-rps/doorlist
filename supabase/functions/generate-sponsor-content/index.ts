import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sponsorName, sponsorData } = await req.json();
    console.log('Generating content for sponsor:', sponsorName);
    console.log('Sponsor data:', sponsorData);
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing');
    }

    const prompt = `
      As an expert in real estate investment, create detailed and contextual editorial content for ${sponsorName}.
      Use the following information about the sponsor:
      - Founded: ${sponsorData.year_founded || 'N/A'}
      - Headquarters: ${sponsorData.headquarters || 'N/A'}
      - Assets Under Management: ${sponsorData.assets_under_management || 'N/A'}
      - Deal Volume: ${sponsorData.deal_volume || 'N/A'}
      - Number of Deals: ${sponsorData.number_of_deals || 'N/A'}
      - Investment Types: ${sponsorData.investment_types?.join(', ') || 'N/A'}
      - Property Types: ${sponsorData.property_types?.join(', ') || 'N/A'}

      Generate the following sections:
      1. Track Record (focus on their experience and success)
      2. Investment Strategy (their approach to real estate investment)
      3. Team Highlights (key strengths of their leadership)
      4. Notable Deals (mention significant investments)
      5. Market Focus (their target markets and sectors)
      6. Investment Philosophy (their principles and approach)

      Make it professional, factual, and engaging. Each section should be 2-3 sentences long.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a real estate investment expert writing professional editorial content for investment sponsors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    const content = data.choices[0].message.content;

    // Parse the content into sections
    const sections = {
      track_record: '',
      investment_strategy: '',
      team_highlights: '',
      notable_deals: '',
      market_focus: '',
      investment_philosophy: ''
    };

    const contentSections = content.split('\n\n');
    contentSections.forEach(section => {
      if (section.includes('Track Record:')) {
        sections.track_record = section.replace('Track Record:', '').trim();
      } else if (section.includes('Investment Strategy:')) {
        sections.investment_strategy = section.replace('Investment Strategy:', '').trim();
      } else if (section.includes('Team Highlights:')) {
        sections.team_highlights = section.replace('Team Highlights:', '').trim();
      } else if (section.includes('Notable Deals:')) {
        sections.notable_deals = section.replace('Notable Deals:', '').trim();
      } else if (section.includes('Market Focus:')) {
        sections.market_focus = section.replace('Market Focus:', '').trim();
      } else if (section.includes('Investment Philosophy:')) {
        sections.investment_philosophy = section.replace('Investment Philosophy:', '').trim();
      }
    });

    // Update the sponsor in the database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Updating sponsor with sections:', sections);
    
    const { error: updateError } = await supabase
      .from('sponsors')
      .update(sections)
      .eq('name', sponsorName);

    if (updateError) {
      console.error('Error updating sponsor:', updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true, sections }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});