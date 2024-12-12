import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const payload = await req.json();
  const { type, record, old_record } = payload;

  // Initialize Supabase client with service role key
  try {
    switch (type) {
      case 'INSERT': {
        // Handle new profile creation
        if (payload.table === 'profiles') {
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', record.id)
            .single();

          if (userData) {
            await fetch(`${supabaseUrl}/functions/v1/klaviyo-events`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                event: 'New User Profile Created',
                customer_properties: {
                  $email: userData.email,
                  $first_name: userData.first_name,
                  $last_name: userData.last_name,
                  phone_number: userData.phone_number,
                },
                properties: {
                  is_accredited_investor: userData.is_accredited_investor,
                  created_at: userData.created_at,
                },
              }),
            });
          }
        }

        // Handle new investment inquiry
        if (payload.table === 'investment_inquiries') {
          const { data: inquiryData } = await supabase
            .from('investment_inquiries')
            .select(`
              *,
              profiles (email, first_name, last_name, phone_number),
              investments (name, minimum_investment, target_return)
            `)
            .eq('id', record.id)
            .single();

          if (inquiryData?.profiles) {
            await fetch(`${supabaseUrl}/functions/v1/klaviyo-events`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                event: 'Investment Inquiry Created',
                customer_properties: {
                  $email: inquiryData.profiles.email,
                  $first_name: inquiryData.profiles.first_name,
                  $last_name: inquiryData.profiles.last_name,
                  phone_number: inquiryData.profiles.phone_number,
                },
                properties: {
                  investment_name: inquiryData.investments?.name,
                  minimum_investment: inquiryData.investments?.minimum_investment,
                  target_return: inquiryData.investments?.target_return,
                  created_at: inquiryData.created_at,
                },
              }),
            });
          }
        }

        // Handle new sponsor introduction
        if (payload.table === 'sponsor_introductions') {
          const { data: introData } = await supabase
            .from('sponsor_introductions')
            .select(`
              *,
              profiles (email, first_name, last_name, phone_number),
              sponsors (name, minimum_investment, advertised_returns)
            `)
            .eq('id', record.id)
            .single();

          if (introData?.profiles) {
            await fetch(`${supabaseUrl}/functions/v1/klaviyo-events`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                event: 'Sponsor Introduction Requested',
                customer_properties: {
                  $email: introData.profiles.email,
                  $first_name: introData.profiles.first_name,
                  $last_name: introData.profiles.last_name,
                  phone_number: introData.profiles.phone_number,
                },
                properties: {
                  sponsor_name: introData.sponsors?.name,
                  minimum_investment: introData.sponsors?.minimum_investment,
                  advertised_returns: introData.sponsors?.advertised_returns,
                  created_at: introData.created_at,
                },
              }),
            });
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing database webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});