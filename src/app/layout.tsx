import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Night Reward Calculation",
  description: "Night reward calculation app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={nunito.variable}>
      <body className="bg-secondary">{children}</body>
    </html>
  );
}
