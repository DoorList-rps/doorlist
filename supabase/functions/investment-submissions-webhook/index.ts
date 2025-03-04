
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const payload = await req.json();
  const { type, record, table } = payload;

  // Initialize Supabase client with service role key
  try {
    // Handle new investment submission
    if (table === 'investment_submissions' && type === 'INSERT') {
      console.log('New investment submission received:', record.name);
      
      // Get user details
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', record.user_id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
      }

      // Send notification via Klaviyo if configured
      if (Deno.env.get('KLAVIYO_PRIVATE_KEY')) {
        await fetch(`${supabaseUrl}/functions/v1/klaviyo-events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            event: 'New Investment Submission',
            customer_properties: {
              $email: userData?.email,
              $first_name: userData?.first_name,
              $last_name: userData?.last_name,
              phone_number: userData?.phone_number,
            },
            properties: {
              investment_name: record.name,
              property_type: record.property_type,
              investment_type: record.investment_type,
              minimum_investment: record.minimum_investment,
              target_return: record.target_return,
              created_at: record.created_at,
            },
          }),
        });
      }

      // You could also implement email notifications here
      // Add your email notification logic
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing investment submission webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
