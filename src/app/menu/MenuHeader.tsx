import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MenuHeader() {
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
