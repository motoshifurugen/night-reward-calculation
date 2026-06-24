import Link from "next/link";
import { Bell, ChevronLeft } from "lucide-react";

export type NavbarVariant = "home" | "menu";

interface NavbarProps {
  readonly variant: NavbarVariant;
}

function HomeNavbar() {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <header className="flex items-center justify-between px-4 py-3 shadow-sm">
      <div>
        <p className="font-bold text-xl">ホーム</p>
        <p data-testid="home-date" className="text-sm opacity-50">{dateLabel}</p>
      </div>
      <button
        data-testid="bell-button"
        id="bell-button"
        className="p-2 bg-white shadow rounded-full"
      >
        <span className="text-xl">
          <Bell />
        </span>
      </button>
    </header>
  );
}

function MenuNavbar() {
  return (
    <header className="relative flex items-center px-4 py-3 min-h-18 shadow-sm">
      <Link
        href="/"
        data-testid="back-button"
        className="z-10 text-gray-700 hover:text-gray-900"
        aria-label="戻る"
      >
        <ChevronLeft size={22} />
      </Link>
      <div
        data-testid="menu-title-wrapper"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <h1 className="font-bold text-xl text-gray-800">献立</h1>
      </div>
    </header>
  );
}

export default function Navbar({ variant }: NavbarProps) {
  if (variant === "menu") return <MenuNavbar />;
  return <HomeNavbar />;
}
