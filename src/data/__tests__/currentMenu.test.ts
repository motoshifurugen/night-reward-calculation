import { describe, it, expect } from "vitest";
import currentMenuData from "../currentMenu.json";

type DailyEntry = {
  date: string;
  weight: number;
  meals: {
    breakfast: unknown[];
    lunch: unknown[];
    dinner: unknown[];
  };
};

describe("currentMenu.json", () => {
  it("targetCalorie が存在する", () => {
    expect(typeof currentMenuData.targetCalorie).toBe("number");
    expect(currentMenuData.targetCalorie).toBeGreaterThan(0);
  });

  it("targetWeight が存在する", () => {
    expect(typeof currentMenuData.targetWeight).toBe("number");
    expect(currentMenuData.targetWeight).toBeGreaterThan(0);
  });

  it("weeklyHistory が存在しない", () => {
    expect((currentMenuData as Record<string, unknown>).weeklyHistory).toBeUndefined();
  });

  it("dailyHistory が配列として存在する", () => {
    const data = currentMenuData as unknown as { dailyHistory: unknown };
    expect(Array.isArray(data.dailyHistory)).toBe(true);
  });

  it("dailyHistory の各エントリに date, weight, meals が存在する", () => {
    const data = currentMenuData as unknown as { dailyHistory: DailyEntry[] };
    data.dailyHistory.forEach((entry) => {
      expect(typeof entry.date).toBe("string");
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof entry.weight).toBe("number");
      expect(entry.meals).toBeDefined();
      expect(Array.isArray(entry.meals.breakfast)).toBe(true);
      expect(Array.isArray(entry.meals.lunch)).toBe(true);
      expect(Array.isArray(entry.meals.dinner)).toBe(true);
    });
  });

  it("dailyHistory に 7月末まで献立が設定されている（最終エントリが 2026-07-31）", () => {
    const data = currentMenuData as unknown as { dailyHistory: DailyEntry[] };
    const dates = data.dailyHistory.map((e) => e.date).sort();
    expect(dates[dates.length - 1]).toBe("2026-07-31");
  });

  it("dailyHistory に日付の抜けがない（連続している）", () => {
    const data = currentMenuData as unknown as { dailyHistory: DailyEntry[] };
    const dates = data.dailyHistory.map((e) => e.date).sort();
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBe(1);
    }
  });

  it("dailyHistory の日付が昇順に並んでいる", () => {
    const data = currentMenuData as unknown as { dailyHistory: DailyEntry[] };
    const dates = data.dailyHistory.map((e) => e.date);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });

  it("全ての食事枠が埋まっている（空の配列がない）", () => {
    const data = currentMenuData as unknown as { dailyHistory: DailyEntry[] };
    data.dailyHistory.forEach((entry) => {
      expect(entry.meals.breakfast.length).toBeGreaterThan(0);
      expect(entry.meals.lunch.length).toBeGreaterThan(0);
      expect(entry.meals.dinner.length).toBeGreaterThan(0);
    });
  });
});
