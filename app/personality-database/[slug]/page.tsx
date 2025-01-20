"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MessageSquare, Users2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

// MBTI type definitions
const mbtiTypes = {
  INTJ: {
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
  },
  // Add other MBTI types as needed
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
        // Get personality data from Supabase
        const { data: personalityData, error: supabaseError } = await supabase
          .from("personalities")
          .select("*")
          .eq("name", params.slug)
          .single();

        if (supabaseError) throw supabaseError;
        if (!personalityData) throw new Error("Personality not found");

        setPersonalityData(personalityData);

        // Fetch Wikipedia data using wiki_name
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${personalityData.wiki_name}`
        );
        const wikiData = await wikiResponse.json();
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

  if (!personalityData || !wikiData) {
    return (
      <div className="min-h-[100dvh] bg-black text-white flex items-center justify-center">
        Personality not found
      </div>
    );
  }

  // Add console.log to debug
  console.log("MBTI Type:", personalityData.mbti_type);

  // Get MBTI type data with safety check
  const mbtiTypeData =
    mbtiTypes[
      personalityData.mbti_type.toUpperCase() as keyof typeof mbtiTypes
    ];

  // Add safety check for mbtiTypeData
  if (!mbtiTypeData) {
    return (
      <div className="min-h-[100dvh] bg-black text-white flex items-center justify-center">
        MBTI type data not found
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      {/* Back to Database Link */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/personality-database"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Database
        </Link>
      </div>

      {/* Header with Profile */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex gap-8 items-start">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
              <Image
                src={wikiData?.thumbnail?.source || "/placeholder-profile.jpg"}
                alt={personalityData?.name || "Profile"}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{personalityData?.name}</h1>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium">
                  {personalityData?.mbti_type}
                </span>
              </div>

              {personalityData?.occupation && (
                <p className="text-gray-400 text-lg mb-6">
                  {personalityData.occupation}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  className="bg-white text-black hover:bg-white/90 inline-flex items-center"
                  onClick={() => setIsChatOpen?.(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 inline-flex items-center"
                >
                  <Users2 className="w-4 h-4 mr-2" />
                  View Similar Types
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Cognitive Functions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Cognitive Functions</h2>
            <div className="space-y-4">
              {mbtiTypeData.functions.map((func, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-white/20 p-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{func.name}</span>
                    <span className="text-sm text-gray-400">{func.role}</span>
                  </div>
                  <p className="text-sm text-gray-400">{func.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Type Description and Common Traits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Type Description</h2>
              <div className="p-4 rounded-lg border border-white/20">
                <p className="text-gray-400">
                  <span className="text-white font-medium">
                    {personalityData.mbti_type}
                  </span>{" "}
                  - {mbtiTypeData.description}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Common Traits</h2>
              <div className="grid grid-cols-2 gap-3">
                {mbtiTypeData.traits.map((trait, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-white/20"
                  >
                    <span className="text-sm">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Background */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Background</h2>
          <div className="rounded-lg border border-white/20 p-6">
            <p className="text-gray-400">{wikiData.extract}</p>
            <div className="mt-4 text-sm text-gray-500">Source: Wikipedia</div>
          </div>
        </div>
      </main>
    </div>
  );
}
