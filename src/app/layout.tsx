import type { Metadata } from "next";
import "./globals.css";
import TrackBeacon from "@/components/TrackBeacon";

export const metadata: Metadata = {
  title: "2X Investing — Lifestyle Investing, By Invitation",
  description: "A boutique house of curated alternative-investment offerings for qualified investors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><TrackBeacon />{children}</body>
    </html>
  );
}
