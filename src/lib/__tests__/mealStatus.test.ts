import { describe, it, expect } from "vitest";
import { calcMealTarget, calcMealStatus } from "../mealStatus";

describe("calcMealTarget", () => {
  it("朝食の目標カロリーは全体の30%", () => {
    expect(calcMealTarget(2000, "breakfast")).toBe(600);
  });

  it("昼食の目標カロリーは全体の40%", () => {
    expect(calcMealTarget(2000, "lunch")).toBe(800);
  });

  it("夕食の目標カロリーは全体の30%", () => {
    expect(calcMealTarget(2000, "dinner")).toBe(600);
  });

  it("端数は四捨五入される", () => {
    expect(calcMealTarget(1500, "breakfast")).toBe(450);
  });
});

describe("calcMealStatus", () => {
  it("登録合計が目標を超過したら danger", () => {
    expect(calcMealStatus(1401, 1400)).toBe("danger");
  });

  it("登録合計が目標と同値なら warning", () => {
    expect(calcMealStatus(1400, 1400)).toBe("warning");
  });

  it("登録合計が目標から199kcal未満なら warning", () => {
    expect(calcMealStatus(1201, 1400)).toBe("warning");
  });

  it("登録合計が目標からちょうど200kcal下なら warning (境界値)", () => {
    expect(calcMealStatus(1200, 1400)).toBe("warning");
  });

  it("登録合計が目標から201kcal以上下なら health", () => {
    expect(calcMealStatus(1199, 1400)).toBe("health");
  });

  it("登録合計が0なら health", () => {
    expect(calcMealStatus(0, 1400)).toBe("health");
  });
});
