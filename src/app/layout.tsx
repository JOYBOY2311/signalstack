import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulsadar — AI Buying Intent Radar for Dev Teams",
  description:
    "Stop missing customers who are already looking for you. Pulsadar monitors Reddit, HN, Twitter, and more — surfaces buying-intent signals with AI scoring and response drafts.",
  openGraph: {
    title: "Pulsadar",
    description: "Every customer starts as a signal. Catch them first.",
    type: "website",
    siteName: "Pulsadar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulsadar",
    description: "AI Buying Intent Radar for Dev Teams — $10/mo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
