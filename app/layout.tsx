import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stablecharacter - The Five Love Languages Test",
  description:
    "Discover your primary love languages with a quick, free assessment. Understand how you prefer to give and receive love.",
  openGraph: {
    title: "Stablecharacter - The Five Love Languages Test",
    description:
      "Discover your primary love languages with a quick, free assessment. Understand how you prefer to give and receive love.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stablecharacter - The Five Love Languages Test",
    description:
      "Discover your primary love languages with a quick, free assessment. Understand how you prefer to give and receive love.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    // @ts-expect-error Server Component
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="HandheldFriendly" content="true" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1TKZY373XY"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1TKZY373XY');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
