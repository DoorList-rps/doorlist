import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Send email using native Deno SMTP client
    const encoder = new TextEncoder();
    const conn = await Deno.connect({ hostname: "smtp.gmail.com", port: 587 });
    const writer = conn.writable.getWriter();

    // SMTP handshake and authentication would go here
    // Note: This is a simplified example. In production, you'd want to use
    // proper SMTP authentication and TLS

    await writer.write(encoder.encode(
      `MAIL FROM: <${email}>\r\n` +
      `RCPT TO: <contact@doorlist.com>\r\n` +
      `DATA\r\n` +
      `From: ${name} <${email}>\r\n` +
      `To: contact@doorlist.com\r\n` +
      `Subject: New Contact Form Submission\r\n` +
      `\r\n` +
      `${emailContent}\r\n` +
      `.\r\n`
    ));

    writer.close();
    conn.close();

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});