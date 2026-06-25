import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UpcomingMenu from "../../menu/UpcomingMenu";

// today=2026-07-28 → upcoming: 07-29(水)〜08-05(水)
// データあり: 07-29(1452), 07-30(1682), 07-31(1864)
// データなし: 08-01〜08-05

describe("UpcomingMenu", () => {
  it("'未来の献立' タイトルが表示される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    expect(screen.getByText("未来の献立")).toBeInTheDocument();
  });

  it("8日分のカラムが描画される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    expect(screen.getAllByTestId("upcoming-day-col")).toHaveLength(8);
  });

  it("データがある日のカロリーが表示される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    const cals = screen.getAllByTestId("upcoming-calorie");
    expect(cals[0]).toHaveTextContent("1,452kcal");
    expect(cals[1]).toHaveTextContent("1,682kcal");
    expect(cals[2]).toHaveTextContent("1,864kcal");
  });

  it("データがない日は '-' が表示される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    const cals = screen.getAllByTestId("upcoming-calorie");
    // インデックス 3〜7 はデータなし
    for (let i = 3; i <= 7; i++) {
      expect(cals[i]).toHaveTextContent("-");
    }
  });

  it("日曜日 (08-02) のラベルが赤で表示される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    // 08-02 は日曜
    const labels = screen.getAllByTestId("upcoming-day-label");
    const sunLabel = labels[4]; // 0-indexed: 07-29,07-30,07-31,08-01,08-02
    expect(sunLabel).toHaveClass("text-red-500");
  });

  it("土曜日 (08-01) のラベルが青で表示される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    const labels = screen.getAllByTestId("upcoming-day-label");
    const satLabel = labels[3]; // 08-01 は土曜
    expect(satLabel).toHaveClass("text-blue-500");
  });

  it("各日付の '日(曜)' 形式でラベルが表示される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    const labels = screen.getAllByTestId("upcoming-day-label");
    expect(labels[0]).toHaveTextContent("29(水)");
    expect(labels[3]).toHaveTextContent("1(土)");
  });

  it("データあり日の食事スロットには画像が表示される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    const images = screen.getAllByTestId("upcoming-meal-image");
    expect(images.length).toBeGreaterThan(0);
  });

  it("データなし日の食事スロットにはアイコンが表示される", () => {
    render(<UpcomingMenu today="2026-07-28" />);
    const icons = screen.getAllByTestId("upcoming-meal-icon");
    expect(icons.length).toBeGreaterThan(0);
  });
});
