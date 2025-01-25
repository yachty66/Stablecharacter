import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

interface Personality {
  name: string;
}

function generateSiteMap(personalities: Personality[]): string {
  const baseUrl = 'https://stablecharacter.com';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static routes -->
     <url>
       <loc>${baseUrl}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${baseUrl}/personality-database</loc>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${baseUrl}/big-five-personality-test</loc>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     
     <!-- Dynamic personality routes -->
     ${personalities
       .map(({ name }) => {
         return `
       <url>
           <loc>${`${baseUrl}/personality-database/${name.toLowerCase().replace(/\s+/g, '-')}`}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all personalities
    const { data: personalities, error } = await supabase
      .from("personalities")
      .select("name")
      .order('id');

    if (error) {
      throw error;
    }

    // Generate the XML sitemap
    const sitemap = generateSiteMap(personalities || []);

    // Return the XML with proper headers
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap with just static routes if there's an error
    const basicSitemap = generateSiteMap([]);
    return new NextResponse(basicSitemap, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}