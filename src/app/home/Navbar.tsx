import {Bell} from "lucide-react"

export default function Navbar() {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <nav className="flex items-center justify-between px-4 py-3 shadow-sm">
      <div>
        <p className="font-bold text-xl">ホーム</p>
        <p className="text-sm opacity-50">{dateLabel}</p>
      </div>
      <button id="bell-button" className="p-2 bg-white shadow rounded-full">
        <span className="text-xl">
          <Bell />
        </span>
      </button>
    </nav>
  );
}
