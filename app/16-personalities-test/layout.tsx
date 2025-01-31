import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free 16 Personalities Test | Stablecharacter",
  description:
    "Take the comprehensive 16 personalities test and discover your personality type. Find characters that match your MBTI personality type. Free, no registration required.",
  openGraph: {
    title: "Free 16 Personalities Test | Stablecharacter",
    description:
      "Take the comprehensive 16 personalities test and discover your personality type. Find characters that match your MBTI personality type.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 16 Personalities Test | Stablecharacter",
    description:
      "Take the comprehensive 16 personalities test and discover your personality type. Find characters that match your MBTI personality type.",
  },
  keywords: [
    "16 personalities test",
    "MBTI test",
    "personality type test",
    "Myers-Briggs test",
    "free personality test",
    "MBTI compatibility",
    "personality assessment",
    "character personality match",
  ],
};

export default function SixteenPersonalitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
