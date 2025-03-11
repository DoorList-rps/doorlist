
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const zapierWebhookUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const payload = await req.json();
  const { type, record, table, old_record } = payload;

  try {
    // Handle profiles (new or updated)
    if (table === 'profiles') {
      console.log(`Profile ${type === 'INSERT' ? 'created' : 'updated'}: ${record.email}`);
      
      // Prepare data for Zapier
      const profileData = {
        event: type === 'INSERT' ? 'New User Profile' : 'Profile Update',
        profile: {
          id: record.id,
          email: record.email,
          first_name: record.first_name,
          last_name: record.last_name,
          phone_number: record.phone_number,
          is_accredited_investor: record.is_accredited_investor,
          created_at: record.created_at,
          updated_at: record.updated_at
        },
        changes: type === 'UPDATE' ? getChangedFields(record, old_record) : null
      };

      // Send to Zapier if configured
      if (zapierWebhookUrl) {
        console.log('Sending profile data to Zapier webhook');
        try {
          const zapierResponse = await fetch(zapierWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
          });
          
          console.log('Zapier response status:', zapierResponse.status);
        } catch (zapierError) {
          console.error('Error sending to Zapier:', zapierError);
        }
      }

      // Send notification via Klaviyo if configured
      if (Deno.env.get('KLAVIYO_PRIVATE_KEY')) {
        const eventName = type === 'INSERT' ? 'New User Profile Created' : 'User Profile Updated';
        await fetch(`${supabaseUrl}/functions/v1/klaviyo-events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            event: eventName,
            customer_properties: {
              $email: record.email,
              $first_name: record.first_name,
              $last_name: record.last_name,
              phone_number: record.phone_number,
            },
            properties: {
              is_accredited_investor: record.is_accredited_investor,
              updated_at: record.updated_at,
              changes: type === 'UPDATE' ? getChangedFields(record, old_record) : null
            },
          }),
        });
      }
    }

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

      // Prepare data for Zapier
      const submissionData = {
        submission: {
          id: record.id,
          name: record.name,
          property_type: record.property_type,
          investment_type: record.investment_type,
          investment_vehicle: record.investment_vehicle,
          minimum_investment: record.minimum_investment,
          target_return: record.target_return,
          created_at: record.created_at,
        },
        user: userData ? {
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number,
        } : null
      };

      // Send to Zapier if configured
      if (zapierWebhookUrl) {
        console.log('Sending to Zapier webhook');
        try {
          const zapierResponse = await fetch(zapierWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData),
          });
          
          console.log('Zapier response status:', zapierResponse.status);
        } catch (zapierError) {
          console.error('Error sending to Zapier:', zapierError);
        }
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
              investment_vehicle: record.investment_vehicle,
              minimum_investment: record.minimum_investment,
              target_return: record.target_return,
              created_at: record.created_at,
            },
          }),
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to get changed fields between old and new record
function getChangedFields(newRecord: any, oldRecord: any): Record<string, { old: any, new: any }> {
  if (!oldRecord) return {};
  
  const changes: Record<string, { old: any, new: any }> = {};
  
  for (const key in newRecord) {
    if (JSON.stringify(newRecord[key]) !== JSON.stringify(oldRecord[key])) {
      changes[key] = {
        old: oldRecord[key],
        new: newRecord[key]
      };
    }
  }
  
  return changes;
}
