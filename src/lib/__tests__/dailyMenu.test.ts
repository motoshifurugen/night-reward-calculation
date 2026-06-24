import { describe, it, expect } from "vitest";
import {
  calcItemCalorie,
  calcMealCalorie,
  calcDayCalorie,
  buildMenuMap,
  resolveRegisteredItems,
} from "../dailyMenu";
import type { MenuItem, DailyMeals } from "../dailyMenu";

const ramen: MenuItem = {
  id: "ramen",
  name: "ラーメン",
  caloriesPerServing: 500,
  caloriesPer100g: 90,
  imageUrl: "https://example.com/ramen.jpg",
};

const gyoza: MenuItem = {
  id: "gyoza",
  name: "餃子",
  caloriesPerServing: 200,
  caloriesPer100g: 195,
  imageUrl: "https://example.com/gyoza.jpg",
};

const whiteRice: MenuItem = {
  id: "white-rice",
  name: "白米",
  caloriesPerServing: 252,
  caloriesPer100g: 168,
  imageUrl: "https://example.com/rice.jpg",
};

describe("calcItemCalorie", () => {
  it("servings=1: caloriesPerServing をそのまま返す", () => {
    expect(calcItemCalorie({ menuId: "ramen", servings: 1 }, ramen)).toBe(500);
  });

  it("servings=2: 2倍を返す", () => {
    expect(calcItemCalorie({ menuId: "ramen", servings: 2 }, ramen)).toBe(1000);
  });

  it("grams=100: caloriesPer100g をそのまま返す", () => {
    expect(calcItemCalorie({ menuId: "ramen", grams: 100 }, ramen)).toBe(90);
  });

  it("grams=200: 2倍を返す", () => {
    expect(calcItemCalorie({ menuId: "ramen", grams: 200 }, ramen)).toBe(180);
  });

  it("grams=150 × 168kcal/100g = 252 (四捨五入)", () => {
    expect(calcItemCalorie({ menuId: "white-rice", grams: 150 }, whiteRice)).toBe(252);
  });
});

describe("calcMealCalorie", () => {
  const menuMap = buildMenuMap([ramen, gyoza]);

  it("複数アイテムのカロリー合計を返す", () => {
    const items = [
      { menuId: "ramen", servings: 1 },
      { menuId: "gyoza", servings: 1 },
    ] as const;
    expect(calcMealCalorie(items, menuMap)).toBe(700);
  });

  it("空配列のとき 0 を返す", () => {
    expect(calcMealCalorie([], menuMap)).toBe(0);
  });

  it("menuMap にない menuId はスキップする", () => {
    expect(calcMealCalorie([{ menuId: "unknown", servings: 1 }], menuMap)).toBe(0);
  });
});

describe("calcDayCalorie", () => {
  const misoSoup: MenuItem = {
    id: "miso-soup",
    name: "味噌汁",
    caloriesPerServing: 36,
    caloriesPer100g: 18,
    imageUrl: "",
  };
  const menuMap = buildMenuMap([ramen, misoSoup]);

  const meals: DailyMeals = {
    breakfast: [{ menuId: "miso-soup", servings: 1 }],
    lunch: [{ menuId: "ramen", servings: 1 }],
    dinner: [],
  };

  it("全食事のカロリー合計を返す", () => {
    expect(calcDayCalorie(meals, menuMap)).toBe(536);
  });

  it("全て空のとき 0 を返す", () => {
    const empty: DailyMeals = { breakfast: [], lunch: [], dinner: [] };
    expect(calcDayCalorie(empty, menuMap)).toBe(0);
  });
});

describe("buildMenuMap", () => {
  it("menuId をキーとする Map を返す", () => {
    const map = buildMenuMap([ramen, gyoza]);
    expect(map.get("ramen")).toBe(ramen);
    expect(map.get("gyoza")).toBe(gyoza);
    expect(map.size).toBe(2);
  });
});

describe("resolveRegisteredItems", () => {
  const menuMap = buildMenuMap([ramen]);

  it("servings 指定を RegisteredItem に変換する", () => {
    const result = resolveRegisteredItems([{ menuId: "ramen", servings: 1 }], menuMap);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      menuId: "ramen",
      name: "ラーメン",
      calorie: 500,
      imageUrl: "https://example.com/ramen.jpg",
    });
  });

  it("grams 指定も RegisteredItem に変換する", () => {
    const result = resolveRegisteredItems([{ menuId: "ramen", grams: 100 }], menuMap);
    expect(result[0].calorie).toBe(90);
  });

  it("menuMap にない menuId はスキップする", () => {
    const result = resolveRegisteredItems([{ menuId: "unknown", servings: 1 }], menuMap);
    expect(result).toHaveLength(0);
  });

  it("空配列のとき空配列を返す", () => {
    expect(resolveRegisteredItems([], menuMap)).toHaveLength(0);
  });
});
