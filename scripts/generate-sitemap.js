import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const supabaseUrl = process.env.SUPABASE_URL || "https://iavmizyezxogctfrbvxh.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm1penllenhvZ2N0ZnJidnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5OTEwNzgsImV4cCI6MjA0ODU2NzA3OH0.Mk825aTDa3FSlUPkKXPk0pOsr7xaYEloFAF5Rd9wdAw";

const supabase = createClient(supabaseUrl, supabaseKey);

const generateSitemapXML = (urls) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

async function generateStaticSitemap() {
  const staticUrls = [
    { loc: 'https://doorlist.com/', changefreq: 'daily', priority: '1.0' },
    { loc: 'https://doorlist.com/investments', changefreq: 'daily', priority: '0.9' },
    { loc: 'https://doorlist.com/sponsors', changefreq: 'daily', priority: '0.9' },
    { loc: 'https://doorlist.com/education', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://doorlist.com/about', changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://doorlist.com/calculator', changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://doorlist.com/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: 'https://doorlist.com/faq', changefreq: 'monthly', priority: '0.6' },
    { loc: 'https://doorlist.com/privacy', changefreq: 'yearly', priority: '0.3' },
    { loc: 'https://doorlist.com/terms', changefreq: 'yearly', priority: '0.3' },
  ];
  
  return generateSitemapXML(staticUrls);
}

async function generateSponsorsSitemap() {
  const { data: sponsors, error } = await supabase
    .from('sponsors')
    .select('slug')
    .eq('approved', true);

  if (error) {
    console.error('Error fetching sponsors:', error);
    return null;
  }

  const sponsorUrls = sponsors?.map(sponsor => ({
    loc: `https://doorlist.com/sponsors/${sponsor.slug}`,
    changefreq: 'weekly',
    priority: '0.8'
  })) || [];

  return generateSitemapXML(sponsorUrls);
}

async function generateInvestmentsSitemap() {
  const { data: investments, error } = await supabase
    .from('investments')
    .select('slug')
    .eq('approved', true);

  if (error) {
    console.error('Error fetching investments:', error);
    return null;
  }

  const investmentUrls = investments?.map(investment => ({
    loc: `https://doorlist.com/investments/${investment.slug}`,
    changefreq: 'weekly',
    priority: '0.8'
  })) || [];

  return generateSitemapXML(investmentUrls);
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
    
    // Get the directory of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicDir = path.join(__dirname, '..', 'public');
    
    // Generate all sitemaps
    const [staticSitemap, sponsorsSitemap, investmentsSitemap, sitemapIndex] = await Promise.all([
      generateStaticSitemap(),
      generateSponsorsSitemap(),
      generateInvestmentsSitemap(),
      generateSitemapIndex()
    ]);

    // Ensure the public directory exists
    await fs.mkdir(publicDir, { recursive: true });
    
    // Write all sitemap files
    await Promise.all([
      fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapIndex),
      fs.writeFile(path.join(publicDir, 'sitemap-static.xml'), staticSitemap),
      sponsorsSitemap && fs.writeFile(path.join(publicDir, 'sitemap-sponsors.xml'), sponsorsSitemap),
      investmentsSitemap && fs.writeFile(path.join(publicDir, 'sitemap-investments.xml'), investmentsSitemap)
    ].filter(Boolean));

    console.log('All sitemaps generated successfully!');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    process.exit(1); // Exit with error to indicate failure
  }
}

// Run the sitemap generation
generateSitemaps();