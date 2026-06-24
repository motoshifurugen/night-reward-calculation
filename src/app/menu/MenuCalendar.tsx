"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { getDailyDataMap } from "@/lib/dailyMenuData";
import { buildMonthDays, countRegisteredMeals } from "@/lib/monthCalendar";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

function dowOfDate(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

function numberColor(count: number, isToday: boolean, dow: number): string {
  if (isToday) return "text-white";
  if (count === 3) return "text-health font-bold";
  if (dow === 0) return "text-red-400";
  if (dow === 6) return "text-blue-400";
  return "text-gray-700";
}

interface MenuCalendarProps {
  readonly today?: string;
}

export default function MenuCalendar({
  today = new Date().toISOString().split("T")[0],
}: MenuCalendarProps) {
  const [ty, tm] = today.split("-").map(Number);
  const [viewYear, setViewYear] = useState(ty);
  const [viewMonth, setViewMonth] = useState(tm);

  const dailyMap = getDailyDataMap();
  const days = buildMonthDays(viewYear, viewMonth);

  const goToPrev = () => {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  };

  const goToNext = () => {
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  };

  return (
    <section className="mx-4 my-4">
      <div className="rounded-2xl bg-linear-to-br from-white to-lime-200 p-5 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-amber-500" />
          <h2 className="text-lg font-bold">カレンダー</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="calendar-prev-btn"
            onClick={goToPrev}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
          >
            <ChevronLeft size={16} />
          </button>
          <span
            data-testid="calendar-month-label"
            className="text-sm font-semibold"
          >
            {viewYear}年{viewMonth}月
          </span>
          <button
            data-testid="calendar-next-btn"
            onClick={goToNext}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-md">
        <div
          data-testid="calendar-weekday-header"
          className="grid grid-cols-7 mb-3"
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
            if (!date) return <div key={`empty-${i}`} />;

            const isToday = date === today;
            const daily = dailyMap.get(date);
            const count = countRegisteredMeals(daily);
            const day = parseInt(date.split("-")[2], 10);
            const dow = dowOfDate(date);

            return (
              <div
                key={date}
                data-testid={`calendar-cell-${date}`}
                data-meal-count={count}
                data-today={String(isToday)}
                className="flex flex-col items-center"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm
                    ${isToday ? "bg-amber-400 font-bold" : ""}
                    ${numberColor(count, isToday, dow)}
                  `}
                >
                  {day}
                </div>
                {count >= 1 && (
                  <div
                    data-testid="meal-dot"
                    className="mt-0.5 h-1.5 w-1.5 rounded-full bg-health"
                  />
                )}
                {count === 0 && <div className="mt-0.5 h-1.5 w-1.5" />}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
