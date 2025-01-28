import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dark Triad Personality Test | Stablecharacter",
  description:
    "Take the Dark Triad personality test to measure Machiavellianism, Narcissism, and Psychopathy traits. Discover your personality tendencies. Free, no registration required.",
  openGraph: {
    title: "Dark Triad Personality Test | Stablecharacter",
    description:
      "Take the Dark Triad personality test to measure Machiavellianism, Narcissism, and Psychopathy traits. Discover your personality tendencies.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dark Triad Personality Test | Stablecharacter",
    description:
      "Take the Dark Triad personality test to measure Machiavellianism, Narcissism, and Psychopathy traits. Discover your personality tendencies.",
  },
  keywords: [
    "dark triad test",
    "personality assessment",
    "machiavellianism test",
    "narcissism test",
    "psychopathy test",
    "free personality test",
    "personality traits test",
    "dark personality test",
  ],
};

export default function DarkTriadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
