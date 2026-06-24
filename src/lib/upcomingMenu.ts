const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export function buildUpcomingDates(today: string, count: number): string[] {
  const [y, m, d] = today.split("-").map(Number);
  return Array.from({ length: count }, (_, i) => {
    const next = new Date(y, m - 1, d + i + 1);
    const ny = next.getFullYear();
    const nm = String(next.getMonth() + 1).padStart(2, "0");
    const nd = String(next.getDate()).padStart(2, "0");
    return `${ny}-${nm}-${nd}`;
  });
}

export function formatDayLabel(dateStr: string): { day: number; weekday: string } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return { day: d, weekday: WEEKDAYS[date.getDay()] };
}
