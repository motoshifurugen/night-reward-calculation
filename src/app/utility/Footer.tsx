"use client";
import Link from "next/link";
import { Home, UtensilsCrossed, Settings } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "ホーム", Icon: Home, href: "/" },
  { id: "menu", label: "献立", Icon: UtensilsCrossed, href: "/menu" },
  { id: "settings", label: "設定", Icon: Settings, href: "/settings" },
] as const;

type NavItemId = (typeof NAV_ITEMS)[number]["id"];

interface FooterProps {
  readonly active?: NavItemId;
}

export default function Footer({ active = "home" }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-100 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <nav className="flex justify-around items-center h-16">
        {NAV_ITEMS.map(({ id, label, Icon, href }) => {
          const isActive = id === active;
          return (
            <Link
              key={id}
              href={href}
              data-testid={`footer-${id}`}
              data-active={String(isActive)}
              className="flex flex-col items-center gap-0.5 px-6 py-2"
            >
              <Icon
                size={24}
                className={isActive ? "text-amber-500" : "text-gray-400"}
              />
              <span
                className={`text-xs font-medium ${isActive ? "text-amber-500" : "text-gray-400"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
