export type MealStatus = "danger" | "warning" | "health";
export type MealId = "breakfast" | "lunch" | "dinner";

const MEAL_RATIOS: Record<MealId, number> = {
  breakfast: 0.3,
  lunch:     0.4,
  dinner:    0.3,
};

export function calcMealTarget(targetDailyCalorie: number, mealId: MealId): number {
  return Math.round(targetDailyCalorie * MEAL_RATIOS[mealId]);
}

export function calcMealStatus(registeredTotal: number, targetTotal: number): MealStatus {
  if (registeredTotal > targetTotal) return "danger";
  if (registeredTotal >= targetTotal - 200) return "warning";
  return "health";
}
