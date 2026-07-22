import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2X Investing — Lifestyle Investing, By Invitation",
  description: "A boutique house of curated alternative-investment offerings for qualified investors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
