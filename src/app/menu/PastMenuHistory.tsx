import { History, ChevronRight, Sunrise, Sun, Moon } from "lucide-react";
import todayCalorieData from "../../data/todayCalorie.json";
import { selectMainDish } from "@/lib/mealHistory";
import type { RegisteredItem } from "@/lib/mealHistory";

type MealEntry = {
  readonly id: string;
  readonly label: string;
  readonly registeredItems?: ReadonlyArray<RegisteredItem>;
};

type MealHistoryEntry = {
  readonly date: string;
  readonly totalCalorie: number;
  readonly meals: ReadonlyArray<MealEntry>;
};

const MEAL_ICONS = {
  breakfast: { Icon: Sunrise, iconKey: "sunrise", bg: "bg-orange-100", color: "text-orange-500" },
  lunch:     { Icon: Sun,     iconKey: "sun",     bg: "bg-green-100",  color: "text-green-600"  },
  dinner:    { Icon: Moon,    iconKey: "moon",    bg: "bg-blue-100",   color: "text-blue-500"   },
} as const;

const WEEKDAYS = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
const MONTHS   = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function formatEntry(dateStr: string) {
  const [y, m, day] = dateStr.split("-").map(Number);
  const d = new Date(y, m - 1, day); // ローカルタイムで生成してタイムゾーンズレを防ぐ
  return {
    month:   MONTHS[d.getMonth()],
    day:     d.getDate(),
    weekday: WEEKDAYS[d.getDay()],
  };
}

export default function PastMenuHistory() {
  const { mealHistory } = todayCalorieData as {
    mealHistory: MealHistoryEntry[];
  };

  const recent2 = mealHistory.slice(0, 2);

  return (
    <section className="mx-4 my-4">
      {/* ヘッダー（カード外） */}
      <div className="my-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-amber-500" />
          <h2 className="text-lg font-bold">過去の献立</h2>
        </div>
        <button className="text-sm text-gray-400 hover:text-gray-600">
          すべて見る
        </button>
      </div>

      <div data-testid="past-menu-history" className="rounded-2xl bg-white p-4 shadow-md">
      <div className="flex flex-col gap-3">
        {recent2.map((entry) => {
          const { month, day, weekday } = formatEntry(entry.date);
          return (
            <div
              key={entry.date}
              data-testid="meal-history-entry"
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
            >
              {/* 日付 */}
              <div data-testid="date-block" className="w-10 rounded-lg bg-gray-100 py-1 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase">{month}</p>
                <p className="text-xl font-bold text-gray-700 leading-none">{day}</p>
              </div>

              {/* 曜日 + kcal */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">{weekday}</p>
                <p className="text-xs text-gray-400">
                  {entry.totalCalorie.toLocaleString()} kcal
                </p>
              </div>

              {/* 食事サムネイル or アイコン */}
              <div className="flex items-center gap-1.5">
                {entry.meals.map((meal) => {
                  const cfg = MEAL_ICONS[meal.id as keyof typeof MEAL_ICONS];
                  if (!cfg) return null;
                  const { Icon, iconKey, bg, color } = cfg;

                  const mainDish =
                    meal.registeredItems && meal.registeredItems.length > 0
                      ? selectMainDish(meal.registeredItems)
                      : null;

                  if (mainDish) {
                    return (
                      <img
                        key={meal.id}
                        data-testid="main-dish-image"
                        src={mainDish.imageUrl}
                        alt={mainDish.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    );
                  }

                  return (
                    <span
                      key={meal.id}
                      data-testid={`icon-${meal.id}`}
                      data-icon={iconKey}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${bg}`}
                      aria-label={meal.label}
                    >
                      <Icon size={16} className={color} />
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
