import menuData from "../../data/menu.json";
import { getDailyDataMap } from "@/lib/dailyMenuData";
import { buildMenuMap } from "@/lib/dailyMenu";
import type { MenuItem } from "@/lib/dailyMenu";
import {
  buildMonthDays,
  calcDayStatus,
  countRegisteredMeals,
} from "@/lib/monthCalendar";
import type { DayStatus } from "@/lib/monthCalendar";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

const STATUS_CLASSES: Record<DayStatus, string> = {
  danger:  "bg-red-400 text-white",
  warning: "bg-amber-400 text-white",
  health:  "bg-health text-white",
  none:    "text-gray-400",
};

interface MonthCalendarProps {
  readonly today?: string;
}

export default function MonthCalendar({
  today = new Date().toISOString().split("T")[0],
}: MonthCalendarProps) {
  const [y, m] = today.split("-").map(Number);
  const dailyMap = getDailyDataMap();
  buildMenuMap(menuData as MenuItem[]);

  const days = buildMonthDays(y, m);

  return (
    <section className="mx-4 my-4">
      <div className="rounded-2xl bg-linear-to-br from-white to-lime-200 p-5 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">今月の記録状況</h2>
          <p className="text-sm text-gray-500">{y}年{m}月</p>
        </div>

        <div
          data-testid="calendar-weekday-header"
          className="grid grid-cols-7 mb-2"
        >
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className={`text-center text-xs font-semibold ${
                wd === "日" ? "text-red-400" : wd === "土" ? "text-blue-400" : "text-gray-500"
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2">
          {days.map((date, i) => {
            if (!date) {
              return <div key={`empty-${i}`} />;
            }

            const isToday = date === today;
            const isPastOrToday = date <= today;
            const daily = dailyMap.get(date);
            const count = countRegisteredMeals(daily);
            const status = calcDayStatus(count, isPastOrToday);
            const day = parseInt(date.split("-")[2], 10);

            return (
              <div
                key={date}
                data-testid={`calendar-day-${date}`}
                data-status={status}
                data-today={String(isToday)}
                className="flex justify-center"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
                    ${STATUS_CLASSES[status]}
                    ${isToday ? "ring-2 ring-amber-400 ring-offset-1" : ""}
                  `}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
