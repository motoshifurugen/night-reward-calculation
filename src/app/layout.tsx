import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NightReward",
  description: "カロリー・食事管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-white text-[#1A1A1A]">{children}</body>
    </html>
  );
}
