import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TodayMenu from "../home/TodayMenu";

describe("TodayMenu", () => {
  it("'今日の献立' タイトルが表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    expect(screen.getByText("今日の献立")).toBeInTheDocument();
  });

  it("今日の日付が日本語形式で表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    expect(screen.getByTestId("today-menu-date")).toHaveTextContent("5月28日");
  });

  it("曜日が表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    // 2026-05-28 is Thursday (木)
    expect(screen.getByTestId("today-menu-date")).toHaveTextContent("木");
  });

  it("登録カロリー合計 / 目標カロリーが表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    const calorie = screen.getByTestId("today-total-calorie");
    expect(calorie).toBeInTheDocument();
    expect(calorie.textContent).toMatch(/kcal/);
  });

  it("3つの食事カードが表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    expect(screen.getByTestId("meal-card-breakfast")).toBeInTheDocument();
    expect(screen.getByTestId("meal-card-lunch")).toBeInTheDocument();
    expect(screen.getByTestId("meal-card-dinner")).toBeInTheDocument();
  });

  it("登録済み食事カードにはメイン料理の画像が表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    const images = screen.getAllByTestId("today-meal-image");
    expect(images.length).toBeGreaterThan(0);
    images.forEach((img) => expect(img).toHaveAttribute("src"));
  });

  it("未登録の食事には '未登録' が表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    expect(screen.getByText("未登録")).toBeInTheDocument();
  });

  it("メインカードの data-status が正しいステータスを持つ", () => {
    render(<TodayMenu today="2026-05-28" />);
    const card = screen.getByTestId("today-menu-card");
    // breakfast(368) + lunch(700) = 1068, target 600+800=1400, diff=332 > 200 → health
    expect(card).toHaveAttribute("data-status", "health");
  });

  it("朝食ラベルが表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    expect(screen.getByText("朝食")).toBeInTheDocument();
  });

  it("昼食ラベルが表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    expect(screen.getByText("昼食")).toBeInTheDocument();
  });

  it("夕食ラベルが表示される", () => {
    render(<TodayMenu today="2026-05-28" />);
    expect(screen.getByText("夕食")).toBeInTheDocument();
  });
});
