"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Brain, MessageSquare, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonalityTrait {
  trait: string;
  score: number;
  description: string;
}

const personalityTraits: PersonalityTrait[] = [
  {
    trait: "Introversion",
    score: 75,
    description:
      "Prefers deep focus and solitary work, but can be publicly engaging when needed",
  },
  {
    trait: "Intuition",
    score: 90,
    description: "Strong focus on future possibilities and innovative concepts",
  },
  {
    trait: "Thinking",
    score: 85,
    description: "Makes decisions based on logic and objective analysis",
  },
  {
    trait: "Judging",
    score: 80,
    description: "Systematic approach to goals with strong planning tendencies",
  },
];

const keyCharacteristics = [
  "Visionary thinking",
  "Technical expertise",
  "Direct communication",
  "Risk-taking",
  "Workaholic tendencies",
  "Strategic mindset",
];

export default function PersonalityProfile() {
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
                src="/personalities/elon-musk.jpg"
                alt="Elon Musk"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Elon Musk</h1>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm font-medium">
                  INTJ
                </span>
              </div>

              <p className="text-muted-foreground mb-4">
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
            {/* Personality Analysis */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Personality Analysis
              </h2>
              <div className="space-y-4">
                {personalityTraits.map((trait) => (
                  <div key={trait.trait} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">
                        {trait.trait}
                      </span>
                      <span className="text-sm text-gray-400">
                        {trait.score}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${trait.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400">{trait.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Characteristics */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Key Characteristics
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {keyCharacteristics.map((characteristic) => (
                  <div
                    key={characteristic}
                    className="p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm text-white">{characteristic}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Cognitive Functions
                </h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="w-5 h-5 text-white" />
                      <span className="font-medium text-white">
                        Introverted Intuition (Ni)
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Primary function that drives long-term vision and
                      future-oriented thinking
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="w-5 h-5 text-white" />
                      <span className="font-medium text-white">
                        Extraverted Thinking (Te)
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Secondary function for logical decision-making and
                      systematic planning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
