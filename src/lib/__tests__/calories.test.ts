import { describe, it, expect } from "vitest";
import { sumCalories } from "../calories";

describe("sumCalories", () => {
  it("空配列のとき 0 を返す", () => {
    expect(sumCalories([])).toBe(0);
  });

  it("1件のカロリーをそのまま返す", () => {
    expect(sumCalories([300])).toBe(300);
  });

  it("複数件のカロリーを合計する", () => {
    expect(sumCalories([100, 200, 300])).toBe(600);
  });

  it("小数点を含む場合も正しく合計する", () => {
    expect(sumCalories([100.5, 200.5])).toBe(301);
  });
});
