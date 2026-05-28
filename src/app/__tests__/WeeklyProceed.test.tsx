import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WeeklyProceed from "../home/WeeklyProceed";

describe("WeeklyProceed", () => {
  it("タイトル '週間トレンド' が表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByText(/週間トレンド/)).toBeInTheDocument();
  });

  it("凡例に 'kcal' が表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("legend-kcal")).toBeInTheDocument();
  });

  it("凡例に 'kg' が表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("legend-kg")).toBeInTheDocument();
  });

  it("'過去1週間の平均' テキストが表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByText(/過去1週間の平均/)).toBeInTheDocument();
  });

  it("平均カロリー表示エリアが存在する", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("weekly-avg-calorie")).toBeInTheDocument();
  });

  it("平均カロリーに '1,764' が表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("weekly-avg-calorie")).toHaveTextContent("1,764");
  });

  it("X 軸に '今日' ラベルが表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByText("今日")).toBeInTheDocument();
  });

  it("チャート SVG が描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("weekly-trend-chart")).toBeInTheDocument();
  });

  it("カロリーラインが描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("calorie-line")).toBeInTheDocument();
  });

  it("体重ラインが描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("weight-line")).toBeInTheDocument();
  });

  it("今日の点 (ドット) が描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("today-dot")).toBeInTheDocument();
  });

  it("体重の下限参照ライン（①）が描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("weight-lower-line")).toBeInTheDocument();
  });

  it("体重の上限参照ライン（②）が描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByTestId("weight-upper-line")).toBeInTheDocument();
  });

  it("目標体重ライン（③）が実線で描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    const line = screen.getByTestId("weight-target-line");
    expect(line).toBeInTheDocument();
    // 実線 = strokeDasharray 属性なし
    expect(line).not.toHaveAttribute("strokeDasharray");
  });

  it("下限参照ライン（①）が元の高さ（y≈130）付近に描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    const line = screen.getByTestId("weight-lower-line");
    const y1 = parseFloat(line.getAttribute("y1") || "0");
    expect(y1).toBeGreaterThanOrEqual(120);
    expect(y1).toBeLessThanOrEqual(140);
  });

  it("上限参照ラインのラベル（wgtMax kg）がラインより上（小さい y）に配置される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    const line = screen.getByTestId("weight-upper-line");
    const label = screen.getByText(/70 kg/);
    const lineY = parseFloat(line.getAttribute("y1") || "0");
    const labelY = parseFloat(label.getAttribute("y") || "0");
    expect(labelY).toBeLessThan(lineY);
  });

  it("上限参照ライン（②）がチャート上端付近（y ∈ [18, 25]）に描画される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    const line = screen.getByTestId("weight-upper-line");
    const y1 = parseFloat(line.getAttribute("y1") || "0");
    expect(y1).toBeGreaterThanOrEqual(18);
    expect(y1).toBeLessThanOrEqual(25);
  });

  it("下限ラインに '1000 kcal' ラベルがラインの下側に表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    const line = screen.getByTestId("weight-lower-line");
    const label = screen.getByText(/1000 kcal/);
    const lineY = parseFloat(line.getAttribute("y1") || "0");
    const labelY = parseFloat(label.getAttribute("y") || "0");
    expect(labelY).toBeGreaterThan(lineY);
  });

  it("上限ラインに '3000 kcal' ラベルがラインの下側に表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    const line = screen.getByTestId("weight-upper-line");
    const label = screen.getByText(/3000 kcal/);
    const lineY = parseFloat(line.getAttribute("y1") || "0");
    const labelY = parseFloat(label.getAttribute("y") || "0");
    expect(labelY).toBeGreaterThan(lineY);
  });

  it("'目標カロリー' ラベルが表示される", () => {
    render(<WeeklyProceed today="2026-05-28" />);
    expect(screen.getByText(/目標カロリー/)).toBeInTheDocument();
  });
});
