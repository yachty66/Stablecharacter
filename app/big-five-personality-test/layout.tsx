import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Big Five Personality Test | Stablecharacter",
  description: "Take the scientifically validated Big Five personality test and discover your personality traits. Find MBTI characters that match your personality type. Free, no registration required.",
  openGraph: {
    title: "Free Big Five Personality Test | Stablecharacter",
    description: "Take the scientifically validated Big Five personality test and discover your personality traits. Find MBTI characters that match your personality type.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Big Five Personality Test | Stablecharacter",
    description: "Take the scientifically validated Big Five personality test and discover your personality traits. Find MBTI characters that match your personality type.",
  },
  keywords: [
    "big five personality test",
    "personality assessment",
    "MBTI compatibility",
    "free personality test",
    "personality traits test",
    "scientific personality test",
    "OCEAN personality test"
  ]
};

export default function BigFiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}