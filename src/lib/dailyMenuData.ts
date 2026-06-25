import type { DailyMenuData } from "./dailyMenu";
import currentMenuData from "../data/currentMenu.json";

export const DAILY_MENU_DATA: DailyMenuData[] =
  (currentMenuData as unknown as { dailyHistory: DailyMenuData[] }).dailyHistory;

export function getDailyData(date: string): DailyMenuData | undefined {
  return DAILY_MENU_DATA.find((d) => d.date === date);
}

export function getDailyDataMap(): Map<string, DailyMenuData> {
  return new Map(DAILY_MENU_DATA.map((d) => [d.date, d]));
}
