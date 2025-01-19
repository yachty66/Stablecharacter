"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageSquare, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// This could come from a shared MBTI type definition
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

interface WikiData {
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  description?: string;
}

export default function PersonalityProfile() {
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWikiData() {
      try {
        const response = await fetch(
          "https://en.wikipedia.org/api/rest_v1/page/summary/Elon_Musk"
        );
        const data = await response.json();
        setWikiData(data);
      } catch (error) {
        console.error("Error fetching Wikipedia data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWikiData();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/personality-database"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Database
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 relative rounded-xl overflow-hidden">
              <Image
                src={wikiData?.thumbnail?.source || "/placeholder-profile.jpg"}
                alt="Elon Musk"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Elon Musk</h1>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium">
                  {intjType.name}
                </span>
              </div>

              <p className="text-gray-400 mb-4">
                Entrepreneur, CEO of Tesla and SpaceX
              </p>

              <div className="flex gap-4">
                <Button className="bg-white text-black hover:bg-white/90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Users2 className="w-4 h-4 mr-2" />
                  View Similar Types
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Cognitive Functions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Cognitive Functions
              </h2>
              <div className="space-y-3">
                {intjType.functions.map((func) => (
                  <div
                    key={func.name}
                    className="p-4 rounded-lg border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-2">
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
                    <span className="text-white font-medium">INTJ</span> -
                    Introverted, Intuitive, Thinking, Judging
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Common Traits</h2>
                <div className="grid grid-cols-2 gap-3">
                  {intjType.traits.map((trait) => (
                    <div
                      key={trait}
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
              {isLoading ? (
                <div className="h-20 animate-pulse bg-white/5 rounded" />
              ) : (
                <>
                  <p className="text-gray-400">
                    {wikiData?.extract || "No information available"}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    Source: Wikipedia
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
