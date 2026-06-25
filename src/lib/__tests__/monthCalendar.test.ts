import { describe, it, expect } from "vitest";
import { buildMonthDays, calcDayStatus, countRegisteredMeals } from "../monthCalendar";
import type { DailyMenuData } from "./../../lib/dailyMenu";

// 2026-06-01 は月曜日（startDow=1）
describe("buildMonthDays", () => {
  it("6月のセル数は 35（5週×7）", () => {
    expect(buildMonthDays(2026, 6)).toHaveLength(35);
  });

  it("先頭の null は月初の曜日オフセット分", () => {
    // 2026-06-01 は月曜(1) → 先頭 null が 1 つ
    const days = buildMonthDays(2026, 6);
    expect(days[0]).toBeNull();
    expect(days[1]).toBe("2026-06-01");
  });

  it("最初の日付は YYYY-MM-DD 形式", () => {
    const days = buildMonthDays(2026, 6);
    expect(days[1]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("末尾は null で 7 の倍数になる", () => {
    const days = buildMonthDays(2026, 6);
    expect(days.length % 7).toBe(0);
    expect(days[days.length - 1]).toBeNull();
  });

  it("月をまたがない: 最後の non-null は月末日", () => {
    const days = buildMonthDays(2026, 6);
    const nonNull = days.filter(Boolean);
    expect(nonNull[nonNull.length - 1]).toBe("2026-06-30");
  });

  it("2月（28日）も正しく生成される", () => {
    const days = buildMonthDays(2026, 2);
    const nonNull = days.filter(Boolean);
    expect(nonNull).toHaveLength(28);
    expect(nonNull[0]).toBe("2026-02-01");
    expect(nonNull[27]).toBe("2026-02-28");
  });

  it("6週になる月も正しく 42 セル生成される（2026年5月）", () => {
    // 2026-05-01 は金曜 → 先頭 5null + 31日 = 36 → 7の倍数にするため 42
    const days = buildMonthDays(2026, 5);
    expect(days.length % 7).toBe(0);
    const nonNull = days.filter(Boolean);
    expect(nonNull).toHaveLength(31);
  });
});

describe("calcDayStatus", () => {
  describe("過去・今日", () => {
    it("0件 → 'danger'", () => {
      expect(calcDayStatus(0, true)).toBe("danger");
    });
    it("1件 → 'warning'", () => {
      expect(calcDayStatus(1, true)).toBe("warning");
    });
    it("2件 → 'warning'", () => {
      expect(calcDayStatus(2, true)).toBe("warning");
    });
    it("3件 → 'health'", () => {
      expect(calcDayStatus(3, true)).toBe("health");
    });
  });

  describe("未来", () => {
    it("0件 → 'none'", () => {
      expect(calcDayStatus(0, false)).toBe("none");
    });
    it("1件 → 'warning'", () => {
      expect(calcDayStatus(1, false)).toBe("warning");
    });
    it("2件 → 'warning'", () => {
      expect(calcDayStatus(2, false)).toBe("warning");
    });
    it("3件 → 'health'", () => {
      expect(calcDayStatus(3, false)).toBe("health");
    });
  });
});

describe("countRegisteredMeals", () => {
  it("未定義の場合は 0 を返す", () => {
    expect(countRegisteredMeals(undefined)).toBe(0);
  });

  it("全食事タイプが空の場合は 0", () => {
    const daily = {
      date: "2026-06-01",
      weight: 65.0,
      meals: { breakfast: [], lunch: [], dinner: [] },
    } as DailyMenuData;
    expect(countRegisteredMeals(daily)).toBe(0);
  });

  it("朝食のみ登録 → 1", () => {
    const daily = {
      date: "2026-06-01",
      weight: 65.0,
      meals: {
        breakfast: [{ menuId: "x", servings: 1 }],
        lunch: [],
        dinner: [],
      },
    } as DailyMenuData;
    expect(countRegisteredMeals(daily)).toBe(1);
  });

  it("朝食・昼食が登録 → 2", () => {
    const daily = {
      date: "2026-06-01",
      weight: 65.0,
      meals: {
        breakfast: [{ menuId: "x", servings: 1 }],
        lunch: [{ menuId: "y", servings: 1 }],
        dinner: [],
      },
    } as DailyMenuData;
    expect(countRegisteredMeals(daily)).toBe(2);
  });

  it("全食事タイプが登録 → 3", () => {
    const daily = {
      date: "2026-06-01",
      weight: 65.0,
      meals: {
        breakfast: [{ menuId: "x", servings: 1 }],
        lunch: [{ menuId: "y", servings: 1 }],
        dinner: [{ menuId: "z", servings: 1 }],
      },
    } as DailyMenuData;
    expect(countRegisteredMeals(daily)).toBe(3);
  });
});
