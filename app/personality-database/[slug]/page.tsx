"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface PersonalityData {
  id: string;
  name: string;
  mbti_type: string;
  occupation?: string;
  wiki_name: string;
}

interface WikiData {
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

// Temporary hardcoded data for testing
const intjType = {
  name: "INTJ",
  description: "Introverted, Intuitive, Thinking, Judging",
  functions: [
    {
      name: "Introverted Intuition (Ni)",
      role: "Dominant",
      description:
        "Primary function that drives long-term vision and future-oriented thinking",
    },
    {
      name: "Extraverted Thinking (Te)",
      role: "Auxiliary",
      description:
        "Secondary function for logical decision-making and systematic planning",
    },
    {
      name: "Introverted Feeling (Fi)",
      role: "Tertiary",
      description: "Third function for personal values and moral judgments",
    },
    {
      name: "Extraverted Sensing (Se)",
      role: "Inferior",
      description:
        "Fourth function for experiencing and interacting with the immediate environment",
    },
  ],
  traits: [
    "Strategic planning",
    "Analytical thinking",
    "Independent",
    "Knowledge-seeking",
  ],
};

export default function PersonalityProfile() {
  const params = useParams();
  const [personalityData, setPersonalityData] =
    useState<PersonalityData | null>(null);
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchData() {
      try {
        // First get the personality data from Supabase
        const { data: personalityData, error: supabaseError } = await supabase
          .from("personalities")
          .select("*")
          .eq("name", params.slug)
          .single();

        console.log("Supabase data:", personalityData);

        if (supabaseError) throw supabaseError;
        if (!personalityData) throw new Error("Personality not found");

        setPersonalityData(personalityData);

        // Now use the wiki_name from the database to fetch Wikipedia data
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${personalityData.wiki_name}`
        );
        const wikiData = await wikiResponse.json();
        console.log("Wikipedia data:", wikiData);

        setWikiData(wikiData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.slug) {
      fetchData();
    }
  }, [params.slug, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="w-32 h-32 relative rounded-xl overflow-hidden bg-white/10">
              <Image
                src={wikiData?.thumbnail?.source || "/placeholder-profile.jpg"}
                alt={personalityData?.name || "Profile"}
                width={128}
                height={128}
                className="object-cover"
                priority
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{personalityData?.name}</h1>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium">
                  {personalityData?.mbti_type}
                </span>
              </div>
              {personalityData?.occupation && (
                <p className="text-gray-400">{personalityData.occupation}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cognitive Functions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Cognitive Functions</h2>
        <div className="space-y-4">
          {intjType.functions.map((func, index) => (
            <div key={index} className="rounded-lg border border-white/20 p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{func.name}</h3>
                <span className="text-sm text-gray-400">{func.role}</span>
              </div>
              <p className="text-gray-400">{func.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Traits */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Common Traits</h2>
        <div className="flex flex-wrap gap-2">
          {intjType.traits.map((trait, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Background Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Background</h2>
        <div className="rounded-lg border border-white/20 p-6">
          <p className="text-gray-400">{wikiData?.extract}</p>
          <div className="mt-4 text-sm text-gray-500">Source: Wikipedia</div>
        </div>
      </div>
    </div>
  );
}
