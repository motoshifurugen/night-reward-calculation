import "./TodayCalorie.css";
import todayCalorieData from "../../data/todayCalorie.json";
import { sumCalories } from "@/lib/calories";

type MealItem = {
  name: string;
  calorie: number;
};

type Meal = {
  id: string;
  label: string;
  icon: string;
  items: MealItem[];
};

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getProgressStroke(percentage: number): string {
  if (percentage >= 100) return "#CF3333";
  if (percentage >= 80) return "#FF8C00";
  return "url(#progressGradient)";
}

function CircularProgress({ percentage }: { readonly percentage: number }) {
  const clamped = Math.min(percentage, 100);
  const dashOffset = CIRCUMFERENCE * (1 - clamped / 100);
  const stroke = getProgressStroke(percentage);

  return (
    <svg viewBox="0 0 140 140" width="140" height="140">
      <defs>
        <linearGradient
          id="progressGradient"
          x1="70"
          y1="10"
          x2="70"
          y2="130"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#2D8A0A" />
        </linearGradient>
      </defs>
      <circle
        cx="70"
        cy="70"
        r={RADIUS}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="12"
      />
      <circle
        data-testid="calorie-progress-arc"
        cx="70"
        cy="70"
        r={RADIUS}
        fill="none"
        stroke={stroke}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 70 70)"
      />
    </svg>
  );
}

export default function TodayCalorie() {
  const { targetCalorie, meals } = todayCalorieData as {
    targetCalorie: number;
    meals: Meal[];
  };

  const mealTotals = meals.map((meal) =>
    sumCalories(meal.items.map((item) => item.calorie))
  );
  const totalConsumed = sumCalories(mealTotals);
  const remaining = targetCalorie - totalConsumed;
  const percentage = (totalConsumed / targetCalorie) * 100;

  return (
    <section className="mx-4 my-4 rounded-2xl bg-linear-to-br from-white to-lime-200 p-5 shadow-md">
      {/* ヘッダー: タイトル (左) / 目標カロリー (右上) */}
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-base font-bold">今日の摂取カロリー</h2>
        <p
          data-testid="calorie-target"
          className="rounded-full border border-primary px-3 py-0.5 text-xs font-semibold text-primary"
        >
          目標 {targetCalorie.toLocaleString()} kcal
        </p>
      </div>

      {/* ボディ: チャート (左) / 残カロリー (右) */}
      <div className="mb-5 flex items-center justify-start gap-6">
        <div className="calorie-chart-wrapper">
          <CircularProgress percentage={percentage} />
          <div className="calorie-chart-center">
            <p
              data-testid="calorie-consumed"
              className="m-0 font-outfit text-3xl font-bold leading-none tabular-nums"
            >
              {totalConsumed.toLocaleString()}
            </p>
            <p className="m-0 text-xs font-semibold uppercase tracking-widest text-gray-500">kcal</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1">
          <p className="m-0 text-xs text-gray-500">残り</p>
          <div className="flex items-baseline gap-1">
            <p
              data-testid="calorie-remaining"
              className="m-0 font-outfit text-2xl font-bold leading-none tabular-nums text-green-500"
            >
              {remaining.toLocaleString()}
            </p>
            <p className="m-0 text-xs text-gray-500">kcal</p>
          </div>
          <p
            data-testid="calorie-message"
            className="m-0 mt-2 text-xs text-gray-600"
          >
            &ldquo;順調です！あと少しで目標達成✨&rdquo;
          </p>
        </div>
      </div>

    </section>
  );
}
