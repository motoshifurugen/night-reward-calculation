import type { RegisteredItem } from "./dailyHistory";

export type DailyMealItem =
  | { readonly menuId: string; readonly servings: number }
  | { readonly menuId: string; readonly grams: number };

export type DailyMeals = {
  readonly breakfast: ReadonlyArray<DailyMealItem>;
  readonly lunch: ReadonlyArray<DailyMealItem>;
  readonly dinner: ReadonlyArray<DailyMealItem>;
};

export type DailyMenuData = {
  readonly date: string;
  readonly weight: number;
  readonly meals: DailyMeals;
};

export type MenuItem = {
  readonly id: string;
  readonly name: string;
  readonly caloriesPerServing: number;
  readonly caloriesPer100g: number;
  readonly imageUrl: string;
};

export function calcItemCalorie(item: DailyMealItem, menu: MenuItem): number {
  if ("servings" in item) {
    return Math.round(menu.caloriesPerServing * item.servings);
  }
  return Math.round((menu.caloriesPer100g * item.grams) / 100);
}

export function buildMenuMap(
  menuList: ReadonlyArray<MenuItem>
): Map<string, MenuItem> {
  return new Map(menuList.map((m) => [m.id, m]));
}

export function calcMealCalorie(
  items: ReadonlyArray<DailyMealItem>,
  menuMap: Map<string, MenuItem>
): number {
  return items.reduce((sum, item) => {
    const menu = menuMap.get(item.menuId);
    return menu ? sum + calcItemCalorie(item, menu) : sum;
  }, 0);
}

export function calcDayCalorie(
  meals: DailyMeals,
  menuMap: Map<string, MenuItem>
): number {
  return (
    calcMealCalorie(meals.breakfast, menuMap) +
    calcMealCalorie(meals.lunch, menuMap) +
    calcMealCalorie(meals.dinner, menuMap)
  );
}

export function resolveRegisteredItems(
  items: ReadonlyArray<DailyMealItem>,
  menuMap: Map<string, MenuItem>
): RegisteredItem[] {
  return items.flatMap((item) => {
    const menu = menuMap.get(item.menuId);
    if (!menu) return [];
    return [
      {
        menuId: item.menuId,
        name: menu.name,
        calorie: calcItemCalorie(item, menu),
        imageUrl: menu.imageUrl,
      },
    ];
  });
}
