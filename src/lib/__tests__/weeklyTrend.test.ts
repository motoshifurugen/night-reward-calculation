import { describe, it, expect } from "vitest";
import {
  buildChartPoints,
  averageCalorie,
  normalizeY,
  smoothPath,
  snapWeightBase,
  computeTargetLineY,
  calorieToY,
} from "../weeklyTrend";

const records = [
  { date: "2026-05-22", calorie: 1850, weight: 65.8 },
  { date: "2026-05-23", calorie: 1600, weight: 65.6 },
  { date: "2026-05-24", calorie: 2100, weight: 65.9 },
  { date: "2026-05-25", calorie: 1750, weight: 65.5 },
  { date: "2026-05-26", calorie: 1950, weight: 65.3 },
  { date: "2026-05-27", calorie: 1450, weight: 65.1 },
  { date: "2026-05-28", calorie: 1650, weight: 64.9 },
];

describe("buildChartPoints", () => {
  it("today が '今日' にラベルされる", () => {
    const points = buildChartPoints(records, "2026-05-28");
    expect(points[points.length - 1].label).toBe("今日");
    expect(points[points.length - 1].isToday).toBe(true);
  });

  it("今日以外の日付は M/D 形式にフォーマットされる", () => {
    const points = buildChartPoints(records, "2026-05-28");
    expect(points[0].label).toBe("5/22");
    expect(points[1].label).toBe("5/23");
  });

  it("日付の昇順でソートされ今日が最後になる", () => {
    const shuffled = [...records].reverse();
    const points = buildChartPoints(shuffled, "2026-05-28");
    expect(points[points.length - 1].date).toBe("2026-05-28");
    expect(points[0].date).toBe("2026-05-22");
  });

  it("7件のデータはそのまま返す", () => {
    const points = buildChartPoints(records, "2026-05-28");
    expect(points).toHaveLength(7);
  });

  it("8件以上のデータは直近7件を返す", () => {
    const extra = [
      { date: "2026-05-21", calorie: 1800, weight: 66.0 },
      ...records,
    ];
    const points = buildChartPoints(extra, "2026-05-28");
    expect(points).toHaveLength(7);
    expect(points[0].date).toBe("2026-05-22");
  });

  it("各ポイントにカロリーと体重が含まれる", () => {
    const points = buildChartPoints(records, "2026-05-28");
    expect(points[0].calorie).toBe(1850);
    expect(points[0].weight).toBe(65.8);
  });
});

describe("averageCalorie", () => {
  it("週間平均カロリーを整数で返す", () => {
    expect(averageCalorie(records)).toBe(1764);
  });

  it("空配列の場合 0 を返す", () => {
    expect(averageCalorie([])).toBe(0);
  });

  it("1件の場合はそのカロリーをそのまま返す", () => {
    expect(averageCalorie([records[0]])).toBe(1850);
  });
});

describe("normalizeY", () => {
  it("最大値のとき chartTop を返す", () => {
    expect(normalizeY(100, 0, 100, 10, 80)).toBe(10);
  });

  it("最小値のとき chartTop + chartHeight を返す", () => {
    expect(normalizeY(0, 0, 100, 10, 80)).toBe(90);
  });

  it("中間値のとき中央の y を返す", () => {
    expect(normalizeY(50, 0, 100, 10, 80)).toBeCloseTo(50);
  });

  it("min === max のとき中央の y を返す", () => {
    expect(normalizeY(50, 50, 50, 10, 80)).toBeCloseTo(50);
  });
});

describe("snapWeightBase", () => {
  it("小数点第一位が 0 → 整数部をそのまま返す", () => {
    expect(snapWeightBase(65.0)).toBe(65.0);
    expect(snapWeightBase(70.0)).toBe(70.0);
  });

  it("小数点第一位が 1〜3 → .0 に丸める", () => {
    expect(snapWeightBase(65.1)).toBe(65.0);
    expect(snapWeightBase(65.2)).toBe(65.0);
    expect(snapWeightBase(65.3)).toBe(65.0);
  });

  it("小数点第一位が 4〜6 → .5 に丸める", () => {
    expect(snapWeightBase(65.4)).toBe(65.5);
    expect(snapWeightBase(65.5)).toBe(65.5);
    expect(snapWeightBase(65.6)).toBe(65.5);
  });

  it("小数点第一位が 7〜9 → 整数部を繰り上げ", () => {
    expect(snapWeightBase(65.7)).toBe(66.0);
    expect(snapWeightBase(65.8)).toBe(66.0);
    expect(snapWeightBase(65.9)).toBe(66.0);
  });

  it("base ± 5 が常に 10kg の幅を作る", () => {
    const base = snapWeightBase(65.1);
    expect(base + 5 - (base - 5)).toBe(10);
  });
});

describe("computeTargetLineY", () => {
  const target = 65.1;
  const lowerY = 94; // ① 下限 y 座標（目標体重を体重スケールで正規化した y）
  const upperY = 53; // ② 上限 y 座標（目標カロリーラインの y）

  it("平均が目標より 5kg 以上上回る → lowerY を返す", () => {
    expect(computeTargetLineY(target + 5, target, lowerY, upperY)).toBe(lowerY);
    expect(computeTargetLineY(target + 10, target, lowerY, upperY)).toBe(lowerY);
  });

  it("平均が目標より 5kg 以上下回る → upperY を返す", () => {
    expect(computeTargetLineY(target - 5, target, lowerY, upperY)).toBe(upperY);
    expect(computeTargetLineY(target - 10, target, lowerY, upperY)).toBe(upperY);
  });

  it("平均が目標の 5kg 以内 → (lowerY + upperY) / 2 を返す", () => {
    const mid = (lowerY + upperY) / 2;
    expect(computeTargetLineY(target, target, lowerY, upperY)).toBe(mid);
    expect(computeTargetLineY(target + 4.9, target, lowerY, upperY)).toBe(mid);
    expect(computeTargetLineY(target - 4.9, target, lowerY, upperY)).toBe(mid);
  });

  it("境界値: diff = +5 → lowerY", () => {
    expect(computeTargetLineY(target + 5, target, lowerY, upperY)).toBe(lowerY);
  });

  it("境界値: diff = -5 → upperY", () => {
    expect(computeTargetLineY(target - 5, target, lowerY, upperY)).toBe(upperY);
  });
});

describe("calorieToY", () => {
  const lowerY = 130;
  const upperY = 20;

  it("1000 kcal (下限) → lowerY を返す", () => {
    expect(calorieToY(1000, lowerY, upperY)).toBeCloseTo(lowerY);
  });

  it("3000 kcal (上限) → upperY を返す", () => {
    expect(calorieToY(3000, lowerY, upperY)).toBeCloseTo(upperY);
  });

  it("2000 kcal (中間) → (lowerY + upperY) / 2 を返す", () => {
    expect(calorieToY(2000, lowerY, upperY)).toBeCloseTo((lowerY + upperY) / 2);
  });

  it("範囲外 (500 kcal) は外挿される", () => {
    expect(calorieToY(500, lowerY, upperY)).toBeGreaterThan(lowerY);
  });
});

describe("smoothPath", () => {
  it("空配列のとき空文字を返す", () => {
    expect(smoothPath([])).toBe("");
  });

  it("1点のとき 'M x y' を返す", () => {
    expect(smoothPath([{ x: 10, y: 20 }])).toBe("M 10 20");
  });

  it("複数点のとき 'M' で始まり 'C' を含む文字列を返す", () => {
    const path = smoothPath([
      { x: 0, y: 0 },
      { x: 50, y: 30 },
      { x: 100, y: 10 },
    ]);
    expect(path.startsWith("M")).toBe(true);
    expect(path).toContain("C");
  });
});
