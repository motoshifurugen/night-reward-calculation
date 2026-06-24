export type RegisteredItem = {
  readonly menuId: string;
  readonly name: string;
  readonly calorie: number;
  readonly imageUrl: string;
};

export function selectMainDish(items: ReadonlyArray<RegisteredItem>): RegisteredItem | null {
  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => b.calorie - a.calorie);
  const top = sorted[0];

  // 白米は他のアイテムがある場合はメインから除外する
  if (top.name === "白米" && items.length > 1) {
    return sorted[1];
  }

  return top;
}
