import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get environment variables from process.env or use default values
const supabaseUrl = process.env.SUPABASE_URL || "https://iavmizyezxogctfrbvxh.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm1penllenhvZ2N0ZnJidnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5OTEwNzgsImV4cCI6MjA0ODU2NzA3OH0.Mk825aTDa3FSlUPkKXPk0pOsr7xaYEloFAF5Rd9wdAw";

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');
    
    // Fetch ALL approved investments
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('slug')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (investmentsError) {
      console.error('Error fetching investments:', investmentsError);
      return;
    }

    // Fetch ALL approved sponsors
    const { data: sponsors, error: sponsorsError } = await supabase
      .from('sponsors')
      .select('slug')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (sponsorsError) {
      console.error('Error fetching sponsors:', sponsorsError);
      return;
    }

    console.log(`Found ${investments?.length || 0} approved investments`);
    console.log(`Found ${sponsors?.length || 0} approved sponsors`);

    // Start building the sitemap XML with static routes
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://doorlist.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://doorlist.com/investments</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://doorlist.com/sponsors</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://doorlist.com/education</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://doorlist.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://doorlist.com/calculator</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://doorlist.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://doorlist.com/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://doorlist.com/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://doorlist.com/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;

    // Add ALL sponsor detail pages
    if (sponsors && sponsors.length > 0) {
      console.log('Adding sponsor detail pages to sitemap...');
      sponsors.forEach(sponsor => {
        if (sponsor.slug) {
          sitemap += `
  <url>
    <loc>https://doorlist.com/sponsors/${sponsor.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
    }

    // Add ALL investment detail pages
    if (investments && investments.length > 0) {
      console.log('Adding investment detail pages to sitemap...');
      investments.forEach(investment => {
        if (investment.slug) {
          sitemap += `
  <url>
    <loc>https://doorlist.com/investments/${investment.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
    }

    // Close the sitemap
    sitemap += '\n</urlset>';

    // Get the directory of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    // Write the sitemap to the public directory
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemap);

    console.log('Sitemap generated successfully at:', sitemapPath);
    console.log('Total URLs in sitemap:', 
      10 + // Static routes
      (sponsors?.length || 0) + // Sponsor detail pages
      (investments?.length || 0) // Investment detail pages
    );
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Don't throw error to allow build to complete
  }
}

generateSitemap();