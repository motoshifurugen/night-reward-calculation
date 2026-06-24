import { CalendarDays, Sunrise, Sun, Moon } from "lucide-react";
import menuData from "../../data/menu.json";
import { getDailyDataMap } from "@/lib/dailyMenuData";
import { buildMenuMap, calcMealCalorie, resolveRegisteredItems } from "@/lib/dailyMenu";
import type { MenuItem } from "@/lib/dailyMenu";
import { selectMainDish } from "@/lib/dailyHistory";
import { buildUpcomingDates, formatDayLabel } from "@/lib/upcomingMenu";

const MEAL_IDS = ["breakfast", "lunch", "dinner"] as const;
type MealId = (typeof MEAL_IDS)[number];

const MEAL_ICONS: Record<MealId, { Icon: React.ElementType; bg: string; color: string }> = {
  breakfast: { Icon: Sunrise, bg: "bg-orange-100", color: "text-orange-500" },
  lunch:     { Icon: Sun,     bg: "bg-green-100",  color: "text-green-600"  },
  dinner:    { Icon: Moon,    bg: "bg-blue-100",   color: "text-blue-500"   },
};

function dayLabelColor(weekday: string): string {
  if (weekday === "日") return "text-red-500";
  if (weekday === "土") return "text-blue-500";
  return "text-gray-600";
}

interface UpcomingMenuProps {
  readonly today?: string;
}

export default function UpcomingMenu({
  today = new Date().toISOString().split("T")[0],
}: UpcomingMenuProps) {
  const menuMap = buildMenuMap(menuData as MenuItem[]);
  const dailyMap = getDailyDataMap();
  const upcomingDates = buildUpcomingDates(today, 8);

  return (
    <section className="mx-4 my-4">
      <div className="rounded-2xl bg-linear-to-br from-white to-lime-200 p-4 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays size={18} className="text-amber-500" />
        <h2 className="text-lg font-bold">未来の献立</h2>
      </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {upcomingDates.map((date) => {
            const { day, weekday } = formatDayLabel(date);
            const daily = dailyMap.get(date);
            const meals = daily?.meals ?? { breakfast: [], lunch: [], dinner: [] };

            const totalCal = MEAL_IDS.reduce(
              (sum, id) => sum + calcMealCalorie(meals[id], menuMap),
              0
            );

            return (
              <div
                key={date}
                data-testid="upcoming-day-col"
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2 shadow-md"
              >
                <p
                  data-testid="upcoming-day-label"
                  className={`my-2 text-xs font-semibold ${dayLabelColor(weekday)}`}
                >
                  {day}({weekday})
                </p>

                {MEAL_IDS.map((mealId) => {
                  const items = meals[mealId];
                  const isRegistered = items.length > 0;
                  const resolved = isRegistered
                    ? resolveRegisteredItems(items, menuMap)
                    : [];
                  const mainDish = isRegistered ? selectMainDish(resolved) : null;
                  const cfg = MEAL_ICONS[mealId];

                  return (
                    <div
                      key={mealId}
                      className={
                        isRegistered
                          ? "flex h-16 w-full items-center justify-center rounded-xl bg-white shadow-sm"
                          : `flex h-16 w-full items-center justify-center rounded-xl ${cfg.bg}`
                      }
                    >
                      {mainDish ? (
                        <img
                          data-testid="upcoming-meal-image"
                          src={mainDish.imageUrl}
                          alt={mainDish.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span data-testid="upcoming-meal-icon">
                          <cfg.Icon size={18} className={cfg.color} />
                        </span>
                      )}
                    </div>
                  );
                })}

                <p
                  data-testid="upcoming-calorie"
                  className="my-2 text-center text-xs text-gray-500"
                >
                  {totalCal > 0
                    ? `${totalCal.toLocaleString()}kcal`
                    : "-"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
