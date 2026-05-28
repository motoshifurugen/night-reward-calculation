import todayCalorieData from "../../data/todayCalorie.json";
import {
  buildChartPoints,
  averageCalorie,
  normalizeY,
  smoothPath,
  snapWeightBase,
  computeTargetLineY,
  calorieToY,
} from "@/lib/weeklyTrend";
import type { WeeklyRecord } from "@/lib/weeklyTrend";

const VIEW_W = 320;
const VIEW_H = 200;
const MARGIN = { top: 20, right: 16, bottom: 32, left: 16 };
const CHART_W = VIEW_W - MARGIN.left - MARGIN.right;
const CHART_H = VIEW_H - MARGIN.top - MARGIN.bottom;
const CHART_X = MARGIN.left;
const CHART_Y = MARGIN.top;

const CALORIE_COLOR = "#7CB518";
const WEIGHT_COLOR = "#F97316";
const STROKE_W = 2.5;
const PAD_RATIO = 0.12;
const CALORIE_LOWER = 1000;
const CALORIE_UPPER = 3000;
const TEXT_HEIGHT = 8;

function yRange(values: number[], target: number) {
  const min = Math.min(...values, target);
  const max = Math.max(...values, target);
  const pad = (max - min) * PAD_RATIO || 1;
  return { min: min - pad, max: max + pad };
}

interface WeeklyProceedProps {
  readonly today?: string;
}

export default function WeeklyProceed({
  today = new Date().toISOString().split("T")[0],
}: WeeklyProceedProps) {
  const { targetCalorie, targetWeight, weeklyHistory } = todayCalorieData as {
    targetCalorie: number;
    targetWeight: number;
    weeklyHistory: WeeklyRecord[];
  };

  const points = buildChartPoints(weeklyHistory, today);
  const avgCal = averageCalorie(weeklyHistory);
  const n = points.length;
  const xStep = n > 1 ? CHART_W / (n - 1) : CHART_W;

  const weights = points.map((p) => p.weight);

  // 体重 Y 軸: base ± 5 の固定 10kg レンジ
  const base = snapWeightBase(targetWeight);
  const wgtMin = base - 5;
  const wgtMax = base + 5;

  const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;

  const xPos = (i: number) => CHART_X + i * xStep;

  // 参照ライン Y 位置（先に決定）
  const dynamicWgtRange = yRange(weights, targetWeight);
  const lowerLineY = normalizeY(targetWeight, dynamicWgtRange.min, dynamicWgtRange.max, CHART_Y, CHART_H);
  const upperLineY = CHART_Y;
  const targetLineY = computeTargetLineY(avgWeight, targetWeight, lowerLineY, upperLineY);

  // カロリー Y 軸: 1000〜3000 kcal を lowerLineY〜upperLineY にマッピング
  const targetCalY = calorieToY(targetCalorie, lowerLineY, upperLineY, CALORIE_LOWER, CALORIE_UPPER);
  const calPoints = points.map((p, i) => ({
    x: xPos(i),
    y: calorieToY(p.calorie, lowerLineY, upperLineY, CALORIE_LOWER, CALORIE_UPPER),
  }));

  const wgtPoints = points.map((p, i) => ({
    x: xPos(i),
    y: normalizeY(p.weight, wgtMin, wgtMax, CHART_Y, CHART_H),
  }));

  // 目標カロリーと目標体重が TEXT_HEIGHT 以内なら同一ラインに統合
  const mergeTargetLines = Math.abs(targetCalY - targetLineY) <= TEXT_HEIGHT;

  const todayIdx = points.findIndex((p) => p.isToday);
  const todayDot =
    todayIdx >= 0
      ? { x: xPos(todayIdx), y: wgtPoints[todayIdx].y }
      : null;

  return (
    <section className="mx-4 my-4 rounded-2xl bg-linear-to-br from-white to-lime-200 p-5 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">週間トレンド (カロリー &amp; 体重)</h2>
        <div className="flex items-center gap-3 text-xs font-semibold italic">
          <span data-testid="legend-kcal" className="flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: CALORIE_COLOR }}
            />
            kcal
          </span>
          <span data-testid="legend-kg" className="flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: WEIGHT_COLOR }}
            />
            kg
          </span>
        </div>
      </div>

      <svg
        data-testid="weekly-trend-chart"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* ① 下限参照ライン (点線): 体重ラベル上, 1000 kcal ラベル下 */}
        <line
          data-testid="weight-lower-line"
          x1={CHART_X}
          y1={lowerLineY}
          x2={CHART_X + CHART_W}
          y2={lowerLineY}
          stroke={WEIGHT_COLOR}
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.45"
        />
        <text
          x={CHART_X + 2}
          y={lowerLineY - 2}
          fontSize="7"
          fill={WEIGHT_COLOR}
          opacity="0.6"
        >
          {wgtMin} kg
        </text>
        <text
          x={CHART_X + 2}
          y={lowerLineY + 8}
          fontSize="7"
          fill={CALORIE_COLOR}
          opacity="0.6"
        >
          1000 kcal
        </text>

        {/* ② 上限参照ライン (点線): 体重ラベル上, 3000 kcal ラベル下 */}
        <line
          data-testid="weight-upper-line"
          x1={CHART_X}
          y1={upperLineY}
          x2={CHART_X + CHART_W}
          y2={upperLineY}
          stroke={WEIGHT_COLOR}
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.45"
        />
        <text
          x={CHART_X + 2}
          y={upperLineY - 2}
          fontSize="7"
          fill={WEIGHT_COLOR}
          opacity="0.6"
        >
          {wgtMax} kg
        </text>
        <text
          x={CHART_X + 2}
          y={upperLineY + 8}
          fontSize="7"
          fill={CALORIE_COLOR}
          opacity="0.6"
        >
          3000 kcal
        </text>

        {/* 目標カロリーライン: 目標体重と離れている場合のみ別線 */}
        {!mergeTargetLines && (
          <>
            <line
              data-testid="calorie-target-line"
              x1={CHART_X}
              y1={targetCalY}
              x2={CHART_X + CHART_W}
              y2={targetCalY}
              stroke={CALORIE_COLOR}
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.6"
            />
            <text
              x={CHART_X + 2}
              y={targetCalY + 8}
              fontSize="8"
              fill={CALORIE_COLOR}
              opacity="0.8"
            >
              目標カロリー
            </text>
          </>
        )}

        {/* カロリーライン */}
        <path
          data-testid="calorie-line"
          d={smoothPath(calPoints)}
          fill="none"
          stroke={CALORIE_COLOR}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 体重ライン */}
        <path
          data-testid="weight-line"
          d={smoothPath(wgtPoints)}
          fill="none"
          stroke={WEIGHT_COLOR}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ③ 目標体重ライン (実線): 体重ラベル上, 統合時はカロリーラベルも下に表示 */}
        <line
          data-testid="weight-target-line"
          x1={CHART_X}
          y1={targetLineY}
          x2={CHART_X + CHART_W}
          y2={targetLineY}
          stroke={WEIGHT_COLOR}
          strokeWidth="1.5"
          opacity="0.75"
        />
        <text
          x={CHART_X + 2}
          y={targetLineY - 3}
          fontSize="8"
          fill={WEIGHT_COLOR}
          opacity="0.85"
        >
          目標体重
        </text>
        {mergeTargetLines && (
          <text
            x={CHART_X + 2}
            y={targetLineY + TEXT_HEIGHT}
            fontSize="8"
            fill={CALORIE_COLOR}
            opacity="0.8"
          >
            目標カロリー
          </text>
        )}

        {/* 今日のドット */}
        {todayDot && (
          <circle
            data-testid="today-dot"
            cx={todayDot.x}
            cy={todayDot.y}
            r="5"
            fill={WEIGHT_COLOR}
            stroke="white"
            strokeWidth="2"
          />
        )}

        {/* X 軸ラベル */}
        {points.map((p, i) => (
          <text
            key={p.date}
            x={xPos(i)}
            y={VIEW_H - 6}
            textAnchor="middle"
            fontSize="9"
            fill={p.isToday ? "#374151" : "#6B7280"}
            fontWeight={p.isToday ? "700" : "400"}
          >
            {p.label}
          </text>
        ))}

        {/* 過去1週間の平均ボックス */}
        <rect
          x={CHART_X + CHART_W - 95}
          y={CHART_Y + CHART_H - 38}
          width="95"
          height="38"
          rx="6"
          fill="white"
          opacity="0.9"
        />
        <text
          x={CHART_X + CHART_W - 48}
          y={CHART_Y + CHART_H - 24}
          textAnchor="middle"
          fontSize="8"
          fill="#6B7280"
        >
          過去1週間の平均
        </text>
        <text
          data-testid="weekly-avg-calorie"
          x={CHART_X + CHART_W - 48}
          y={CHART_Y + CHART_H - 10}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={CALORIE_COLOR}
        >
          {avgCal.toLocaleString()} kcal
        </text>
      </svg>
    </section>
  );
}
