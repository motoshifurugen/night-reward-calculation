import { ChevronRight, Sunrise, Sun, Moon } from "lucide-react";
import menuData from "../../data/menu.json";
import { getDailyDataMap } from "@/lib/dailyMenuData";
import {
  buildMenuMap,
  calcMealCalorie,
  resolveRegisteredItems,
} from "@/lib/dailyMenu";
import type { MenuItem, DailyMealItem, DailyMenuData } from "@/lib/dailyMenu";
import { selectMainDish } from "@/lib/dailyHistory";

interface WeeklyMenuProps {
  readonly today?: string;
}

const WEEKDAY_SHORT = ["日", "月", "火", "水", "木", "金", "土"] as const;

const MEAL_ICONS = {
  breakfast: { Icon: Sunrise, label: "朝", bg: "bg-orange-100", color: "text-orange-500" },
  lunch:     { Icon: Sun,     label: "昼", bg: "bg-green-100",  color: "text-green-600"  },
  dinner:    { Icon: Moon,    label: "夜", bg: "bg-blue-100",   color: "text-blue-500"   },
} as const;

function buildWeek(today: string): string[] {
  const [y, m, d] = today.split("-").map(Number);
  const base = new Date(y, m - 1, d);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${mm}-${dd}`;
  });
}

const MEAL_IDS = ["breakfast", "lunch", "dinner"] as const;
type MealId = (typeof MEAL_IDS)[number];

function MealCell({
  mealId,
  items,
  menuMap,
}: {
  readonly mealId: MealId;
  readonly items: ReadonlyArray<DailyMealItem>;
  readonly menuMap: Map<string, MenuItem>;
}) {
  const cfg = MEAL_ICONS[mealId];
  const resolved = resolveRegisteredItems(items, menuMap);
  const main = selectMainDish(resolved);

  if (main) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-full">
        <img
          data-testid={`meal-img-${mealId}`}
          src={main.imageUrl}
          alt={main.name}
          className="h-full w-full object-cover"
        />
        {cfg && (
          <span className="absolute top-1.5 left-1.5 text-white drop-shadow">
            <cfg.Icon size={10} />
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      data-testid={`meal-icon-${mealId}`}
      className="flex aspect-square w-full items-center justify-center rounded-full bg-gray-50"
    >
      {cfg && (
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${cfg.bg}`}>
          <cfg.Icon size={12} className={cfg.color} />
        </span>
      )}
    </div>
  );
}

function DayColumn({
  dateStr,
  daily,
  isToday,
  menuMap,
}: {
  readonly dateStr: string;
  readonly daily: DailyMenuData | undefined;
  readonly isToday: boolean;
  readonly menuMap: Map<string, MenuItem>;
}) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dayNum = date.getDate();
  const weekday = WEEKDAY_SHORT[date.getDay()];

  const meals = daily?.meals ?? { breakfast: [], lunch: [], dinner: [] };
  const calorie =
    calcMealCalorie(meals.breakfast, menuMap) +
    calcMealCalorie(meals.lunch, menuMap) +
    calcMealCalorie(meals.dinner, menuMap);
  const hasMeals =
    meals.breakfast.length > 0 ||
    meals.lunch.length > 0 ||
    meals.dinner.length > 0;

  return (
    <div
      data-testid={`day-col-${dateStr}`}
      data-today={String(isToday)}
      className={`flex flex-1 min-w-0 flex-col rounded-2xl overflow-hidden border-2 ${
        isToday ? "border-amber-400 bg-amber-50" : "border-transparent bg-white"
      }`}
    >
      <div className="py-3 text-center">
        <p className="text-sm font-bold leading-none">{dayNum}</p>
        <p className="text-xs text-gray-500">({weekday})</p>
      </div>

      <div className="flex flex-col gap-3">
        {MEAL_IDS.map((mealId) => (
          <MealCell
            key={mealId}
            mealId={mealId}
            items={meals[mealId]}
            menuMap={menuMap}
          />
        ))}
      </div>

      <div
        data-testid={`day-cal-${dateStr}`}
        className="py-3 text-center text-xs font-semibold text-gray-700"
      >
        {hasMeals ? calorie.toLocaleString() : "-"}
      </div>
    </div>
  );
}

export default function WeeklyMenu({
  today = new Date().toISOString().split("T")[0],
}: WeeklyMenuProps) {
  const menuMap = buildMenuMap(menuData as MenuItem[]);
  const dailyMap = getDailyDataMap();
  const week = buildWeek(today);

  const daysWithData = week.filter((d) => {
    const daily = dailyMap.get(d);
    if (!daily) return false;
    const m = daily.meals;
    return m.breakfast.length > 0 || m.lunch.length > 0 || m.dinner.length > 0;
  });

  const totalCal = daysWithData.reduce((sum, d) => {
    const daily = dailyMap.get(d)!;
    return (
      sum +
      calcMealCalorie(daily.meals.breakfast, menuMap) +
      calcMealCalorie(daily.meals.lunch, menuMap) +
      calcMealCalorie(daily.meals.dinner, menuMap)
    );
  }, 0);

  const avgCal = daysWithData.length > 0 ? Math.round(totalCal / daysWithData.length) : null;

  return (
    <section className="mx-4 my-4">
      <div className="rounded-2xl bg-linear-to-br from-white to-lime-200 p-5 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">今週の献立</h2>
        <button className="flex items-center gap-0.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-amber-500">
          詳細を見る
          <ChevronRight size={14} />
        </button>
      </div>

      <div>
        <div data-testid="weekly-grid" className="flex gap-1 w-full">
          {week.map((dateStr) => (
            <DayColumn
              key={dateStr}
              dateStr={dateStr}
              daily={dailyMap.get(dateStr)}
              isToday={dateStr === today}
              menuMap={menuMap}
            />
          ))}
        </div>

        <div className="mt-3 flex justify-end">
          <div
            data-testid="weekly-avg"
            className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3"
          >
            <div>
              <p className="text-xs text-gray-500">今週の予想平均</p>
              <p className="text-xl font-bold">
                {avgCal !== null ? `${avgCal.toLocaleString()} kcal` : "- kcal"}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
