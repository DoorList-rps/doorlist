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
  try {
    console.log('Fetching approved sponsors...');
    const { data: sponsors, error } = await supabase
      .from('sponsors')
      .select('slug')
      .eq('approved', true);

    if (error) {
      console.error('Error fetching sponsors:', error);
      return null;
    }

    console.log(`Found ${sponsors?.length || 0} approved sponsors`);
    
    const sponsorUrls = sponsors?.map(sponsor => ({
      loc: `https://doorlist.com/sponsors/${sponsor.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    })) || [];

    return generateSitemapXML(sponsorUrls);
  } catch (error) {
    console.error('Error generating sponsors sitemap:', error);
    return null;
  }
}

async function generateInvestmentsSitemap() {
  try {
    console.log('Fetching approved investments...');
    const { data: investments, error } = await supabase
      .from('investments')
      .select('slug')
      .eq('approved', true);

    if (error) {
      console.error('Error fetching investments:', error);
      return null;
    }

    console.log(`Found ${investments?.length || 0} approved investments`);
    
    const investmentUrls = investments?.map(investment => ({
      loc: `https://doorlist.com/investments/${investment.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    })) || [];

    return generateSitemapXML(investmentUrls);
  } catch (error) {
    console.error('Error generating investments sitemap:', error);
    return null;
  }
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

async function writeSitemapFile(publicDir, filename, content) {
  if (!content) {
    console.error(`No content to write for ${filename}`);
    return;
  }
  
  try {
    await fs.writeFile(path.join(publicDir, filename), content, 'utf8');
    console.log(`Successfully wrote ${filename}`);
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

async function generateSitemaps() {
  try {
    console.log('Starting sitemap generation...');
    
    // Get the directory of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicDir = path.join(__dirname, '..', 'public');
    
    // Ensure the public directory exists
    await fs.mkdir(publicDir, { recursive: true });
    
    // Generate all sitemaps
    const [staticSitemap, sponsorsSitemap, investmentsSitemap, sitemapIndex] = await Promise.all([
      generateStaticSitemap(),
      generateSponsorsSitemap(),
      generateInvestmentsSitemap(),
      generateSitemapIndex()
    ]);

    console.log('Generated all sitemap content');
    
    // Write all sitemap files
    await Promise.all([
      writeSitemapFile(publicDir, 'sitemap.xml', sitemapIndex),
      writeSitemapFile(publicDir, 'sitemap-static.xml', staticSitemap),
      writeSitemapFile(publicDir, 'sitemap-sponsors.xml', sponsorsSitemap),
      writeSitemapFile(publicDir, 'sitemap-investments.xml', investmentsSitemap)
    ]);

    console.log('All sitemaps generated and written successfully!');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    process.exit(1); // Exit with error to indicate failure
  }
}

// Run the sitemap generation
generateSitemaps();