import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBTI Personality Database | Stablecharacter",
  description:
    "Explore MBTI types of famous people, leaders, and historical figures. Search by personality type (INTJ, ENFP, etc) or name. Chat with AI trained on their personalities.",
  keywords: [
    "MBTI database",
    "personality database",
    "famous MBTI types",
    "celebrity MBTI",
    "personality types",
    "MBTI examples",
    "myers briggs database",
  ].join(", "),
  openGraph: {
    title: "MBTI Personality Database | Stablecharacter",
    description:
      "Discover MBTI types of famous people. Search by personality type or name and chat with AI trained on their personalities.",
    type: "website",
    url: "https://stablecharacter.com/personality-database",
    siteName: "Stablecharacter MBTI Database",
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI Personality Database",
    description:
      "Explore MBTI types of famous people and chat with AI trained on their personalities.",
  },
  alternates: {
    canonical: "https://stablecharacter.com/personality-database",
  },
};

export default function PersonalityDatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}