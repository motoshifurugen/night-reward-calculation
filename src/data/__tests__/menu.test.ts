import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import menuData from "../menu.json";

const MIN_PHOTO_SIZE_BYTES = 2000;

const VALID_DISH_TYPES = [
  "麺類", "肉料理", "魚料理", "揚げ物", "丼物",
  "粉物", "ご飯物", "野菜料理", "卵料理", "汁物",
] as const;

const VALID_VENUES = [
  "自炊", "ファミレス", "居酒屋", "ラーメン店",
  "定食屋", "回転寿司", "コンビニ", "屋台", "そば・うどん店",
] as const;

const VALID_CALORIE_CATEGORIES = ["低カロリー", "中カロリー", "高カロリー"] as const;

type DishType = typeof VALID_DISH_TYPES[number];
type Venue = typeof VALID_VENUES[number];
type CalorieCategory = typeof VALID_CALORIE_CATEGORIES[number];

type MenuItem = {
  id: string;
  name: string;
  caloriesPerServing: number;
  caloriesPer100g: number;
  imageUrl: string;
  dishType: DishType;
  venues: Venue[];
  calorieCategory: CalorieCategory;
  favorite: boolean;
};

describe("menu.json", () => {
  it("30件のメニューが存在する", () => {
    expect(menuData).toHaveLength(30);
  });

  it("各メニューに必須フィールドが存在する", () => {
    (menuData as MenuItem[]).forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(typeof item.caloriesPerServing).toBe("number");
      expect(typeof item.caloriesPer100g).toBe("number");
      expect(item.imageUrl).toBeTruthy();
    });
  });

  it("カロリーはすべて正の数", () => {
    (menuData as MenuItem[]).forEach((item) => {
      expect(item.caloriesPerServing).toBeGreaterThan(0);
      expect(item.caloriesPer100g).toBeGreaterThan(0);
    });
  });

  it("imageUrl はローカルの /images/meals/ パスを指す写真ファイルである", () => {
    (menuData as MenuItem[]).forEach((item) => {
      expect(item.imageUrl).toMatch(/^\/images\/meals\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/);
    });
  });

  it("imageUrl が指す画像ファイルが public 配下に実在する", () => {
    (menuData as MenuItem[]).forEach((item) => {
      const filePath = join(process.cwd(), "public", item.imageUrl);
      expect(existsSync(filePath)).toBe(true);
    });
  });

  it("imageUrl の画像ファイルがプレースホルダーではない実写真サイズである", () => {
    (menuData as MenuItem[]).forEach((item) => {
      const filePath = join(process.cwd(), "public", item.imageUrl);
      const { size } = statSync(filePath);
      expect(size).toBeGreaterThan(MIN_PHOTO_SIZE_BYTES);
    });
  });

  it("id はすべてユニーク", () => {
    const ids = (menuData as MenuItem[]).map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("dishType が有効な値である", () => {
    (menuData as MenuItem[]).forEach((item) => {
      expect(VALID_DISH_TYPES).toContain(item.dishType);
    });
  });

  it("venues が空でない配列で有効な値のみ含む", () => {
    (menuData as MenuItem[]).forEach((item) => {
      expect(Array.isArray(item.venues)).toBe(true);
      expect(item.venues.length).toBeGreaterThan(0);
      item.venues.forEach((v) => {
        expect(VALID_VENUES).toContain(v);
      });
    });
  });

  it("calorieCategory が有効な値である", () => {
    (menuData as MenuItem[]).forEach((item) => {
      expect(VALID_CALORIE_CATEGORIES).toContain(item.calorieCategory);
    });
  });

  it("calorieCategory が caloriesPerServing と整合している", () => {
    (menuData as MenuItem[]).forEach((item) => {
      if (item.caloriesPerServing < 300) {
        expect(item.calorieCategory).toBe("低カロリー");
      } else if (item.caloriesPerServing < 600) {
        expect(item.calorieCategory).toBe("中カロリー");
      } else {
        expect(item.calorieCategory).toBe("高カロリー");
      }
    });
  });

  it("favorite が boolean である", () => {
    (menuData as MenuItem[]).forEach((item) => {
      expect(typeof item.favorite).toBe("boolean");
    });
  });

  it("ingredients が空でない文字列配列である", () => {
    (menuData as MenuItem[]).forEach((item) => {
      expect(Array.isArray((item as unknown as { ingredients: unknown }).ingredients)).toBe(true);
      const ingredients = (item as unknown as { ingredients: string[] }).ingredients;
      expect(ingredients.length).toBeGreaterThan(0);
      ingredients.forEach((ing) => {
        expect(typeof ing).toBe("string");
        expect(ing.length).toBeGreaterThan(0);
      });
    });
  });
});
