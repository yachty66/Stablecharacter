"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Personality {
  id: number;
  name: string;
  wiki_name: string;
  mbti_type: string;
  image: string;
  prompt: string;
  description: string;
}

const types = [
  "All",
  "INTJ",
  "ENTJ",
  "INTP",
  "ENTP",
  "INFJ",
  "ENFJ",
  "INFP",
  "ENFP",
  "ISTJ",
  "ESTJ",
  "ISFJ",
  "ESFJ",
  "ISTP",
  "ESTP",
  "ISFP",
  "ESFP",
];

const DEFAULT_IMAGE =
  "https://stablecharacter.s3.us-east-1.amazonaws.com/default-avatar.png";

// Helper function to validate if URL is from S3
const isValidS3Url = (url: string) => {
  return url?.includes("stablecharacter.s3.us-east-1.amazonaws.com");
};

// Helper function to convert name to URL-friendly format
const formatNameForUrl = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export default function PersonalityDatabase() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("personalities")
        .select("*")
        .order("id");

      if (error) {
        console.error("Error fetching personalities:", error);
        return;
      }

      setPersonalities(data || []);
    }

    fetchData();
  }, [supabase]);

  const filteredPersonalities = personalities.filter((personality) => {
    if (!personality || !personality.name) return false;
    const matchesSearch = personality.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      selectedType === "All" ||
      (personality.mbti_type &&
        personality.mbti_type.toLowerCase() === selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Personality Database</h1>
          <p className="text-gray-400">
            Explore and chat with personalities based on MBTI types
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search personalities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 bg-transparent border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          {/* MBTI Types Filter */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">MBTI Type</label>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                  className={`
                    ${
                      selectedType === type
                        ? "bg-white text-black hover:bg-white/90"
                        : "border-white/20 text-white hover:bg-white/10"
                    }
                  `}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonalities.map((personality) => (
            <Link
              key={personality.id}
              href={`/personality-database/${personality.name}`}
              className="group h-full"
            >
              <div className="rounded-lg border border-white/20 overflow-hidden hover:border-white/40 transition-colors h-full flex flex-col">
                <div className="aspect-[3/2] relative bg-gray-800 flex-shrink-0">
                  {personality.image && isValidS3Url(personality.image) ? (
                    <Image
                      src={personality.image}
                      alt={
                        personality.wiki_name?.replace(/_/g, " ") || "Character"
                      }
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src={DEFAULT_IMAGE}
                      alt={
                        personality.wiki_name?.replace(/_/g, " ") || "Character"
                      }
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">
                      {personality.wiki_name?.replace(/_/g, " ")}
                    </h3>
                    <span className="px-2 py-1 text-sm bg-white/10 rounded-full flex-shrink-0">
                      {personality.mbti_type || "Unknown"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 flex-grow">
                    {personality.description || "No description available"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
