import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  try {
    // Fetch approved investments and sponsors
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('slug')
      .eq('approved', true);

    if (investmentsError) {
      console.error('Error fetching investments:', investmentsError);
      return;
    }

    const { data: sponsors, error: sponsorsError } = await supabase
      .from('sponsors')
      .select('slug')
      .eq('approved', true);

    if (sponsorsError) {
      console.error('Error fetching sponsors:', sponsorsError);
      return;
    }

    console.log(`Found ${investments?.length || 0} approved investments`);
    console.log(`Found ${sponsors?.length || 0} approved sponsors`);

    // Start building the sitemap XML
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

    // Add investment detail pages
    if (investments) {
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

    // Add sponsor detail pages
    if (sponsors) {
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

    // Close the sitemap
    sitemap += '\n</urlset>';

    // Write the sitemap to the public directory
    await fs.writeFile(
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      sitemap
    );

    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();