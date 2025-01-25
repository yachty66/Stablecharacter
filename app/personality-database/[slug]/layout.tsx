import type { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Initialize Supabase client
  const supabase = createServerComponentClient({ cookies });

  // Get personality data to include MBTI type in metadata
  const { data: personality } = await supabase
    .from("personalities")
    .select("name, mbti_type")
    .eq("name", params.slug)
    .single();

  // Format the name for display (e.g., "elon-musk" -> "Elon Musk")
  const name = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const mbtiType = personality?.mbti_type?.toUpperCase() || "";

  return {
    title: `${name} MBTI Type (${mbtiType}) | Personality Database`,
    description: `Discover ${name}'s MBTI personality type (${mbtiType}). Explore cognitive functions, personality traits, and chat with an AI trained on ${name}'s ${mbtiType} personality type.`,
    keywords: `${name} mbti, ${name} personality type, ${name} ${mbtiType}, what is ${name}'s mbti type, ${mbtiType} personality, ${name} myers briggs type`,
    openGraph: {
      title: `${name} MBTI Type (${mbtiType}) | Personality Database`,
      description: `Discover ${name}'s MBTI personality type (${mbtiType}). Explore cognitive functions, personality traits, and chat with an AI trained on ${name}'s ${mbtiType} personality type.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} MBTI Type (${mbtiType}) | Personality Database`,
      description: `Discover ${name}'s MBTI personality type (${mbtiType}). Explore cognitive functions, personality traits, and chat with an AI trained on ${name}'s ${mbtiType} personality type.`,
    },
  };
}

export default function PersonalityProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
