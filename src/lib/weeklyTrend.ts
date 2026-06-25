/** チャート描画用: カロリーは dailyHistory から計算して付加する */
export type WeeklyRecord = {
  readonly date: string;
  readonly calorie: number;
  readonly weight: number;
};

export type ChartPoint = {
  readonly date: string;
  readonly label: string;
  readonly calorie: number;
  readonly weight: number;
  readonly isToday: boolean;
};

export function buildChartPoints(
  records: ReadonlyArray<WeeklyRecord>,
  today: string
): ChartPoint[] {
  const upToToday = records.filter((r) => r.date <= today);
  const sorted = [...upToToday].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  return last7.map((r) => ({
    date: r.date,
    label: r.date === today ? "今日" : formatDate(r.date),
    calorie: r.calorie,
    weight: r.weight,
    isToday: r.date === today,
  }));
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${parseInt(month)}/${parseInt(day)}`;
}

export function averageCalorie(records: ReadonlyArray<WeeklyRecord>): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.calorie, 0);
  return Math.round(total / records.length);
}

export function normalizeY(
  value: number,
  min: number,
  max: number,
  chartTop: number,
  chartHeight: number
): number {
  if (max === min) return chartTop + chartHeight / 2;
  return chartTop + chartHeight * (1 - (value - min) / (max - min));
}

export function snapWeightBase(targetWeight: number): number {
  const integer = Math.floor(targetWeight);
  const tenths = Math.round((targetWeight - integer) * 10);
  if (tenths >= 7) return integer + 1.0;
  if (tenths >= 4) return integer + 0.5;
  return integer + 0.0;
}

export function computeTargetLineY(
  avgWeight: number,
  targetWeight: number,
  lowerY: number,
  upperY: number
): number {
  const diff = avgWeight - targetWeight;
  if (diff >= 5) return lowerY;
  if (diff <= -5) return upperY;
  return (lowerY + upperY) / 2;
}

export function calorieToY(
  calorie: number,
  lowerY: number,
  upperY: number,
  calorieLower = 1000,
  calorieUpper = 3000
): number {
  if (calorieUpper === calorieLower) return (lowerY + upperY) / 2;
  return lowerY + (upperY - lowerY) * (calorie - calorieLower) / (calorieUpper - calorieLower);
}

export function calcCalorieDomain(
  calories: ReadonlyArray<number>
): { lower: number; upper: number } {
  if (calories.length === 0) return { lower: 1000, upper: 3000 };
  const min = Math.min(...calories);
  const max = Math.max(...calories);
  const lower = Math.floor((min - 500) / 500) * 500;
  const upper = Math.ceil((max + 500) / 500) * 500;
  return { lower, upper };
}

export function calcWeightDomain(
  weights: ReadonlyArray<number>
): { lower: number; upper: number } {
  if (weights.length === 0) return { lower: 50, upper: 100 };
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const lower = Math.floor((min - 5) / 5) * 5;
  const upper = Math.ceil((max + 5) / 5) * 5;
  return { lower, upper };
}

export function smoothPath(
  points: ReadonlyArray<{ x: number; y: number }>
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const tension = 0.4;
  const d: string[] = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    );
  }

  return d.join(" ");
}
