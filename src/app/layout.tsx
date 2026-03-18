import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignalStack — AI Buying Intent Radar for Dev Teams",
  description:
    "Stop missing customers who are already looking for you. SignalStack monitors Reddit, HN, Twitter, and more — surfaces buying-intent signals with AI scoring and response drafts.",
  openGraph: {
    title: "SignalStack",
    description: "Every customer starts as a signal. Catch them first.",
    type: "website",
    siteName: "SignalStack",
  },
  twitter: {
    card: "summary_large_image",
    title: "SignalStack",
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
