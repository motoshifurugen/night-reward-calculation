import { describe, it, expect } from "vitest";
import { selectMainDish } from "../mealHistory";

const item = (name: string, calorie: number) => ({
  menuId: name,
  name,
  calorie,
  imageUrl: `https://example.com/${name}.jpg`,
});

describe("selectMainDish", () => {
  it("空配列のとき null を返す", () => {
    expect(selectMainDish([])).toBeNull();
  });

  it("1件のとき そのアイテムを返す", () => {
    expect(selectMainDish([item("ラーメン", 500)])).toMatchObject({ name: "ラーメン" });
  });

  it("最もカロリーが高いアイテムを返す", () => {
    const items = [item("味噌汁", 36), item("ラーメン", 500), item("餃子", 200)];
    expect(selectMainDish(items)).toMatchObject({ name: "ラーメン" });
  });

  it("最高カロリーが白米で他にアイテムがあるとき次点を返す", () => {
    const items = [item("白米", 252), item("卵焼き", 80)];
    expect(selectMainDish(items)).toMatchObject({ name: "卵焼き" });
  });

  it("白米のみのとき白米を返す", () => {
    expect(selectMainDish([item("白米", 252)])).toMatchObject({ name: "白米" });
  });

  it("白米が最高カロリーでないとき通常ルールを適用する", () => {
    const items = [item("唐揚げ", 350), item("白米", 252), item("サラダ", 82)];
    expect(selectMainDish(items)).toMatchObject({ name: "唐揚げ" });
  });

  it("複数アイテムで白米が最高カロリーのとき次点のアイテムを返す", () => {
    const items = [
      item("白米", 500),
      item("味噌汁", 36),
      item("卵焼き", 80),
    ];
    expect(selectMainDish(items)).toMatchObject({ name: "卵焼き" });
  });
});
