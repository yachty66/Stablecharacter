import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Love Languages Test | Stablecharacter",
  description:
    "Discover your primary love language with our free test. Learn how you prefer to give and receive love based on Gary Chapman's Five Love Languages framework.",
  openGraph: {
    title: "Free Love Languages Test | Stablecharacter",
    description:
      "Discover your primary love language with our free test. Learn how you prefer to give and receive love.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Love Languages Test | Stablecharacter",
    description:
      "Discover your primary love language with our free test. Learn how you prefer to give and receive love.",
  },
  keywords: [
    "love languages test",
    "five love languages",
    "relationship test",
    "gary chapman",
    "words of affirmation",
    "acts of service",
    "receiving gifts",
    "quality time",
    "physical touch",
    "free love language test",
  ],
};

export default function LoveLanguagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
