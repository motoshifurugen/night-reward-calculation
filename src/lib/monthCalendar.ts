import type { DailyMenuData } from "./dailyMenu";

export type DayStatus = "danger" | "warning" | "health" | "none";

export function buildMonthDays(year: number, month: number): Array<string | null> {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDow = firstDay.getDay();

  const cells: Array<string | null> = [];

  for (let i = 0; i < startDow; i++) {
    cells.push(null);
  }

  const mm = String(month).padStart(2, "0");
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${mm}-${String(d).padStart(2, "0")}`);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function calcDayStatus(
  registeredCount: number,
  isPastOrToday: boolean
): DayStatus {
  if (isPastOrToday) {
    if (registeredCount === 0) return "danger";
    if (registeredCount < 3) return "warning";
    return "health";
  }
  if (registeredCount === 0) return "none";
  if (registeredCount < 3) return "warning";
  return "health";
}

export function countRegisteredMeals(
  daily: DailyMenuData | undefined
): number {
  if (!daily) return 0;
  const { breakfast, lunch, dinner } = daily.meals;
  return (
    (breakfast.length > 0 ? 1 : 0) +
    (lunch.length > 0 ? 1 : 0) +
    (dinner.length > 0 ? 1 : 0)
  );
}
