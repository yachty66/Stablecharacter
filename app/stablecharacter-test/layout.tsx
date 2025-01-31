import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Stablecharacter Test | Stablecharacter",
  description:
    "Take the Stablecharacter personality test and discover your personality traits. Find characters that match your personality type. Free, no registration required.",
  openGraph: {
    title: "Free Stablecharacter Test | Stablecharacter",
    description:
      "Take the Stablecharacter personality test and discover your personality traits. Find characters that match your personality type.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Stablecharacter Test | Stablecharacter",
    description:
      "Take the Stablecharacter personality test and discover your personality traits. Find characters that match your personality type.",
  },
  keywords: [
    "stablecharacter test",
    "personality assessment",
    "character compatibility",
    "free personality test",
    "personality traits test",
    "character matching test",
    "personality type test",
  ],
};

export default function StablecharacterTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
