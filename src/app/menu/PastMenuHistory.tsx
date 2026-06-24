import { History, ChevronRight, Sunrise, Sun, Moon } from "lucide-react";
import menuData from "../../data/menu.json";
import { DAILY_MENU_DATA } from "@/lib/dailyMenuData";
import {
  buildMenuMap,
  calcDayCalorie,
  resolveRegisteredItems,
} from "@/lib/dailyMenu";
import type { MenuItem, DailyMenuData } from "@/lib/dailyMenu";
import { selectMainDish } from "@/lib/dailyHistory";

const MEAL_ICONS = {
  breakfast: { Icon: Sunrise, iconKey: "sunrise", bg: "bg-orange-100", color: "text-orange-500" },
  lunch:     { Icon: Sun,     iconKey: "sun",     bg: "bg-green-100",  color: "text-green-600"  },
  dinner:    { Icon: Moon,    iconKey: "moon",    bg: "bg-blue-100",   color: "text-blue-500"   },
} as const;

const MEAL_LABELS: Record<string, string> = {
  breakfast: "朝食",
  lunch: "昼食",
  dinner: "夕食",
};

const WEEKDAYS = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
const MONTHS   = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function formatEntry(dateStr: string) {
  const [y, m, day] = dateStr.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return {
    month:   MONTHS[d.getMonth()],
    day:     d.getDate(),
    weekday: WEEKDAYS[d.getDay()],
  };
}

const MEAL_IDS = ["breakfast", "lunch", "dinner"] as const;

function hasDayData(daily: DailyMenuData): boolean {
  const m = daily.meals;
  return m.breakfast.length > 0 || m.lunch.length > 0 || m.dinner.length > 0;
}

export default function PastMenuHistory() {
  const menuMap = buildMenuMap(menuData as MenuItem[]);

  const recent2 = [...DAILY_MENU_DATA]
    .reverse()
    .filter(hasDayData)
    .slice(0, 2);

  return (
    <section className="mx-4 my-4">
      <div data-testid="past-menu-history" className="rounded-2xl bg-linear-to-br from-white to-lime-200 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-amber-500" />
          <h2 className="text-lg font-bold">過去の献立</h2>
        </div>
        <button className="text-sm text-gray-400 hover:text-gray-600">
          すべて見る
        </button>
      </div>
        <div className="flex flex-col gap-3">
          {recent2.map((entry) => {
            const { month, day, weekday } = formatEntry(entry.date);
            const totalCalorie = calcDayCalorie(entry.meals, menuMap);

            return (
              <div
                key={entry.date}
                data-testid="meal-history-entry"
                className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
              >
                <div data-testid="date-block" className="w-10 rounded-lg bg-gray-100 py-1 text-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase">{month}</p>
                  <p className="text-xl font-bold text-gray-700 leading-none">{day}</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{weekday}</p>
                  <p className="text-xs text-gray-400">
                    {totalCalorie.toLocaleString()} kcal
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {MEAL_IDS.map((mealId) => {
                    const cfg = MEAL_ICONS[mealId];
                    const items = entry.meals[mealId];
                    const resolved = resolveRegisteredItems(items, menuMap);
                    const mainDish = resolved.length > 0 ? selectMainDish(resolved) : null;

                    if (mainDish) {
                      return (
                        <img
                          key={mealId}
                          data-testid="main-dish-image"
                          src={mainDish.imageUrl}
                          alt={mainDish.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      );
                    }

                    return (
                      <span
                        key={mealId}
                        data-testid={`icon-${mealId}`}
                        data-icon={cfg.iconKey}
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${cfg.bg}`}
                        aria-label={MEAL_LABELS[mealId]}
                      >
                        <cfg.Icon size={16} className={cfg.color} />
                      </span>
                    );
                  })}
                </div>

                <ChevronRight size={16} className="text-gray-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
