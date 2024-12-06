import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const supabaseUrl = process.env.SUPABASE_URL || "https://iavmizyezxogctfrbvxh.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm1penllenhvZ2N0ZnJidnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5OTEwNzgsImV4cCI6MjA0ODU2NzA3OH0.Mk825aTDa3FSlUPkKXPk0pOsr7xaYEloFAF5Rd9wdAw";

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateStaticSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
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
  </url>
</urlset>`;
}

async function generateSponsorsSitemap() {
  const { data: sponsors, error: sponsorsError } = await supabase
    .from('sponsors')
    .select('slug')
    .eq('approved', true);

  if (sponsorsError) {
    console.error('Error fetching sponsors:', sponsorsError);
    return null;
  }

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  sponsors?.forEach(sponsor => {
    if (sponsor.slug) {
      sitemap += `
  <url>
    <loc>https://doorlist.com/sponsors/${sponsor.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  });

  sitemap += '\n</urlset>';
  return sitemap;
}

async function generateInvestmentsSitemap() {
  const { data: investments, error: investmentsError } = await supabase
    .from('investments')
    .select('slug')
    .eq('approved', true);

  if (investmentsError) {
    console.error('Error fetching investments:', investmentsError);
    return null;
  }

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  investments?.forEach(investment => {
    if (investment.slug) {
      sitemap += `
  <url>
    <loc>https://doorlist.com/investments/${investment.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  });

  sitemap += '\n</urlset>';
  return sitemap;
}

async function generateSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://doorlist.com/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://doorlist.com/sitemap-sponsors.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://doorlist.com/sitemap-investments.xml</loc>
  </sitemap>
</sitemapindex>`;
}

async function generateSitemaps() {
  try {
    console.log('Starting sitemap generation...');
    
    // Generate all sitemaps
    const [staticSitemap, sponsorsSitemap, investmentsSitemap, sitemapIndex] = await Promise.all([
      generateStaticSitemap(),
      generateSponsorsSitemap(),
      generateInvestmentsSitemap(),
      generateSitemapIndex()
    ]);

    // Get the directory of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicDir = path.join(__dirname, '..', 'public');
    
    // Write all sitemap files
    await Promise.all([
      fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapIndex),
      fs.writeFile(path.join(publicDir, 'sitemap-static.xml'), staticSitemap),
      sponsorsSitemap && fs.writeFile(path.join(publicDir, 'sitemap-sponsors.xml'), sponsorsSitemap),
      investmentsSitemap && fs.writeFile(path.join(publicDir, 'sitemap-investments.xml'), investmentsSitemap)
    ]);

    console.log('Sitemaps generated successfully!');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
  }
}

generateSitemaps();