
// Import necessary dependencies
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const zapierWebhookUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Add CORS headers for browser requests
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
    const payload = await req.json();
    const { type, record, table, old_record } = payload;

    // Only process profile events
    if (table === 'profiles') {
      console.log(`Profile ${type} event received for: ${record.email || record.id}`);
      
      // Prepare data for Zapier
      const profileData = {
        event: type === 'INSERT' ? 'New User Profile Created' : 'User Profile Updated',
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

      // Send to Zapier webhook if configured
      if (zapierWebhookUrl) {
        console.log('Sending profile data to Zapier webhook');
        try {
          const zapierResponse = await fetch(zapierWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
          });
          
          console.log('Zapier response status:', zapierResponse.status);
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: `Profile ${type} event processed successfully`
            }),
            { 
              status: 200,
              headers: { 
                ...corsHeaders,
                'Content-Type': 'application/json' 
              },
            }
          );
        } catch (zapierError) {
          console.error('Error sending to Zapier:', zapierError);
          throw zapierError;
        }
      } else {
        console.error('ZAPIER_WEBHOOK_URL environment variable is not set');
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'ZAPIER_WEBHOOK_URL environment variable is not set'
          }),
          { 
            status: 500,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
          }
        );
      }
    }

    // If we reach here, it wasn't a profile event
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Not a profile event' 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
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
