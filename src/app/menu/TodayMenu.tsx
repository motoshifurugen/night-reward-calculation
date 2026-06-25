import { UtensilsCrossed, Pencil, Sunrise, Sun, Moon } from "lucide-react";
import currentMenuData from "../../data/currentMenu.json";
import menuData from "../../data/menu.json";
import { getDailyData } from "@/lib/dailyMenuData";
import {
  buildMenuMap,
  calcMealCalorie,
  resolveRegisteredItems,
} from "@/lib/dailyMenu";
import type { MenuItem } from "@/lib/dailyMenu";
import { selectMainDish } from "@/lib/dailyHistory";
import { calcMealTarget, calcMealStatus } from "@/lib/mealStatus";
import type { MealStatus, MealId } from "@/lib/mealStatus";

const MEAL_ICONS = {
  breakfast: { Icon: Sunrise, bg: "bg-orange-100", color: "text-orange-500" },
  lunch:     { Icon: Sun,     bg: "bg-green-100",  color: "text-green-600"  },
  dinner:    { Icon: Moon,    bg: "bg-blue-100",   color: "text-blue-500"   },
} as const;

const MEAL_LABELS: Record<string, string> = {
  breakfast: "朝食",
  lunch: "昼食",
  dinner: "夕食",
};

const STATUS_BG: Record<MealStatus, string> = {
  danger:  "bg-red-400",
  warning: "bg-amber-400",
  health:  "bg-green-400",
};

const WEEKDAYS_SHORT = ["日", "月", "火", "水", "木", "金", "土"];

function formatDate(dateStr: string) {
  const [y, m, day] = dateStr.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return {
    month: m,
    day,
    weekday: WEEKDAYS_SHORT[d.getDay()],
  };
}

const MEAL_IDS = ["breakfast", "lunch", "dinner"] as const;

interface TodayMenuProps {
  readonly today?: string;
}

export default function TodayMenu({
  today = new Date().toISOString().split("T")[0],
}: TodayMenuProps) {
  const { targetCalorie } = currentMenuData;
  const menuMap = buildMenuMap(menuData as MenuItem[]);
  const daily = getDailyData(today);
  const { month, day, weekday } = formatDate(today);

  const meals = daily?.meals ?? { breakfast: [], lunch: [], dinner: [] };

  const registeredMealIds = MEAL_IDS.filter((id) => meals[id].length > 0);

  const registeredTotal = registeredMealIds.reduce(
    (sum, id) => sum + calcMealCalorie(meals[id], menuMap),
    0
  );

  const targetTotal = registeredMealIds.reduce(
    (sum, id) => sum + calcMealTarget(targetCalorie, id as MealId),
    0
  );

  const status: MealStatus =
    registeredMealIds.length === 0 ? "health" : calcMealStatus(registeredTotal, targetTotal);

  return (
    <section className="mx-4 my-4">
      <div className="my-5 flex items-center gap-2">
        <UtensilsCrossed size={18} className="text-amber-500" />
        <h2 className="text-lg font-bold">今日の献立</h2>
      </div>

      <div
        data-testid="today-menu-card"
        data-status={status}
        className={`relative overflow-hidden rounded-2xl ${STATUS_BG[status]} p-4 shadow-md`}
      >
        <UtensilsCrossed
          size={100}
          className="absolute right-3 top-3 text-white opacity-15 pointer-events-none"
        />

        <div className="relative flex items-center justify-between">
          <p
            data-testid="today-menu-date"
            className="text-sm font-semibold text-white/90"
          >
            {month}月{day}日 ({weekday})
          </p>
          <button
            aria-label="献立を編集"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white hover:bg-white/50"
          >
            <Pencil size={14} />
          </button>
        </div>

        <p
          data-testid="today-total-calorie"
          className="relative mt-1 text-2xl font-bold text-white"
        >
          {registeredTotal.toLocaleString()} / {targetCalorie.toLocaleString()} kcal
        </p>

        <div className="relative mt-3 grid grid-cols-3 gap-2">
          {MEAL_IDS.map((mealId) => {
            const items = meals[mealId];
            const isRegistered = items.length > 0;
            const resolved = resolveRegisteredItems(items, menuMap);
            const mainDish = isRegistered ? selectMainDish(resolved) : null;
            const mealCalorie = isRegistered ? calcMealCalorie(items, menuMap) : 0;
            const cfg = MEAL_ICONS[mealId];

            return (
              <div
                key={mealId}
                data-testid={`meal-card-${mealId}`}
                className={
                  isRegistered
                    ? "flex flex-col items-center rounded-xl bg-white px-2 py-3 shadow-sm"
                    : "flex flex-col items-center rounded-xl border-2 border-dashed border-white/60 bg-white/40 px-2 py-3"
                }
              >
                {mainDish ? (
                  <img
                    data-testid="today-meal-image"
                    src={mainDish.imageUrl}
                    alt={mainDish.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  cfg && (
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${cfg.bg}`}>
                      <cfg.Icon size={20} className={cfg.color} />
                    </span>
                  )
                )}
                <p className="mt-1.5 text-xs font-semibold text-gray-700">
                  {MEAL_LABELS[mealId]}
                </p>
                {isRegistered ? (
                  <p className="text-xs text-gray-500">{mealCalorie.toLocaleString()}kcal</p>
                ) : (
                  <p className="text-xs text-gray-400">未登録</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
