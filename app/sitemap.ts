import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://stablecharacter.com";

  try {
    // Initialize Supabase client
    const supabase = createServerComponentClient({ cookies });

    // Fetch all personalities
    const { data: personalities } = await supabase
      .from("personalities")
      .select("name")
      .order("id");

    // Static routes
    const staticRoutes = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/personality-database`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/big-five-personality-test`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/16-personalities-test`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/love-languages-test`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/dark-triad-test`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    // Dynamic routes for personalities
    const personalityRoutes = (personalities || []).map((personality) => ({
      url: `${baseUrl}/personality-database/${personality.name}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    // Log the total number of URLs for debugging
    const allRoutes = [...staticRoutes, ...personalityRoutes];
    console.log(`Total URLs in sitemap: ${allRoutes.length}`);
    console.log(
      "Personality URLs:",
      personalityRoutes.map((r) => r.url)
    );

    return [...staticRoutes, ...personalityRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least the static routes if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/personality-database`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/big-five-personality-test`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/16-personalities-test`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/love-languages-test`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/dark-triad-test`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];
  }
}