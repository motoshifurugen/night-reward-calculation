import { UtensilsCrossed, Pencil, Sunrise, Sun, Moon } from "lucide-react";
import todayCalorieData from "../../data/todayCalorie.json";
import { selectMainDish } from "@/lib/mealHistory";
import { calcMealTarget, calcMealStatus } from "@/lib/mealStatus";
import type { RegisteredItem } from "@/lib/mealHistory";
import type { MealStatus, MealId } from "@/lib/mealStatus";

type TodayMeal = {
  readonly id: string;
  readonly label: string;
  readonly registeredItems?: ReadonlyArray<RegisteredItem>;
};

type TodayCalorieData = {
  targetCalorie: number;
  meals: TodayMeal[];
};

const MEAL_ICONS = {
  breakfast: { Icon: Sunrise, bg: "bg-orange-100", color: "text-orange-500" },
  lunch:     { Icon: Sun,     bg: "bg-green-100",  color: "text-green-600"  },
  dinner:    { Icon: Moon,    bg: "bg-blue-100",   color: "text-blue-500"   },
} as const;

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

interface TodayMenuProps {
  readonly today?: string;
}

export default function TodayMenu({
  today = new Date().toISOString().split("T")[0],
}: TodayMenuProps) {
  const { targetCalorie, meals } = todayCalorieData as TodayCalorieData;
  const { month, day, weekday } = formatDate(today);

  const registeredMeals = meals.filter(
    (m) => m.registeredItems && m.registeredItems.length > 0
  );

  const registeredTotal = registeredMeals.reduce(
    (sum, m) => sum + (m.registeredItems ?? []).reduce((s, item) => s + item.calorie, 0),
    0
  );

  const targetTotal = registeredMeals.reduce(
    (sum, m) => sum + calcMealTarget(targetCalorie, m.id as MealId),
    0
  );

  const status: MealStatus =
    registeredMeals.length === 0 ? "health" : calcMealStatus(registeredTotal, targetTotal);

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
        {/* 装飾アイコン */}
        <UtensilsCrossed
          size={100}
          className="absolute right-3 top-3 text-white opacity-15 pointer-events-none"
        />

        {/* 日付 + 編集ボタン */}
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

        {/* カロリー表示 */}
        <p
          data-testid="today-total-calorie"
          className="relative mt-1 text-2xl font-bold text-white"
        >
          {registeredTotal.toLocaleString()} / {targetCalorie.toLocaleString()} kcal
        </p>

        {/* 食事カード列 */}
        <div className="relative mt-3 grid grid-cols-3 gap-2">
          {meals.map((meal) => {
            const isRegistered = meal.registeredItems && meal.registeredItems.length > 0;
            const mainDish = isRegistered
              ? selectMainDish(meal.registeredItems!)
              : null;
            const mealCalorie = isRegistered
              ? (meal.registeredItems ?? []).reduce((s, item) => s + item.calorie, 0)
              : 0;
            const cfg = MEAL_ICONS[meal.id as keyof typeof MEAL_ICONS];

            return (
              <div
                key={meal.id}
                data-testid={`meal-card-${meal.id}`}
                className={
                  isRegistered
                    ? "flex flex-col items-center rounded-xl bg-white px-2 py-3 shadow-sm"
                    : "flex flex-col items-center rounded-xl border-2 border-dashed border-white/60 bg-white/40 px-2 py-3"
                }
              >
                {/* アイコン or 画像 */}
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

                {/* ラベル */}
                <p className="mt-1.5 text-xs font-semibold text-gray-700">
                  {meal.label}
                </p>

                {/* カロリー or 未登録 */}
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
