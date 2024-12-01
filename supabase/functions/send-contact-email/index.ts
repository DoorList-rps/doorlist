import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
    const { name, email, message } = await req.json();

    // Basic validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create email content
    const emailContent = `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;

    const client = new SmtpClient();

    try {
      await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: "contact@doorlist.com",
        password: "your-app-specific-password", // You'll need to set this up in Gmail
      });

      await client.send({
        from: email,
        to: "contact@doorlist.com",
        subject: "New Contact Form Submission",
        content: emailContent,
      });

      await client.close();

      console.log("Email sent successfully");

      return new Response(
        JSON.stringify({ message: 'Email sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }
  } catch (error) {
    console.error("Error in contact form handler:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});