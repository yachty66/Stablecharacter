import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free 16 Personalities Test | Stablecharacter",
  description: "Take the free 16 Personalities test to uncover your MBTI personality type and gain insights into your unique traits. Match with MBTI characters and explore your strengths. No registration required.",
  openGraph: {
    title: "Free 16 Personalities Test | Stablecharacter",
    description: "Take the free 16 Personalities test to uncover your MBTI personality type and gain insights into your unique traits. Match with MBTI characters and explore your strengths.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 16 Personalities Test | Stablecharacter",
    description: "Take the free 16 Personalities test to uncover your MBTI personality type and gain insights into your unique traits. Match with MBTI characters and explore your strengths.",
  },
  keywords: [
    "16 personalities test",
    "MBTI test",
    "free personality test",
    "personality traits test",
    "MBTI characters",
    "Myers-Briggs personality test",
    "discover your personality type"
  ],
};

export default function SixteenPersonalitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
