import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TodayCalorie from "../home/TodayCalorie";

describe("TodayCalorie", () => {
  it("タイトルが表示される", () => {
    render(<TodayCalorie />);
    expect(screen.getByText("今日の摂取カロリー")).toBeInTheDocument();
  });

  it("目標カロリーが右上エリアに表示される", () => {
    render(<TodayCalorie />);
    expect(screen.getByTestId("calorie-target")).toBeInTheDocument();
    expect(screen.getByTestId("calorie-target")).toHaveTextContent("2,000");
  });

  it("消費カロリー合計がチャート中央に表示される (1,450 kcal)", () => {
    render(<TodayCalorie />);
    expect(screen.getByTestId("calorie-consumed")).toHaveTextContent("1,450");
  });

  it("残カロリーが右側に表示される (550 kcal)", () => {
    render(<TodayCalorie />);
    expect(screen.getByTestId("calorie-remaining")).toHaveTextContent("550");
  });

  it("食事カロリー数値は表示されない", () => {
    render(<TodayCalorie />);
    expect(screen.queryByText(/368/)).not.toBeInTheDocument();
    expect(screen.queryByText(/700/)).not.toBeInTheDocument();
    expect(screen.queryByText(/382/)).not.toBeInTheDocument();
  });

  it("円形プログレスアークが描画される", () => {
    render(<TodayCalorie />);
    expect(screen.getByTestId("calorie-progress-arc")).toBeInTheDocument();
  });

  it("通常進捗時、プログレスアークはグラデーションストロークを使用する", () => {
    render(<TodayCalorie />);
    const arc = screen.getByTestId("calorie-progress-arc");
    expect(arc).toHaveAttribute("stroke", "url(#progressGradient)");
  });

  it("SVGにlinearGradientの定義が含まれる", () => {
    const { container } = render(<TodayCalorie />);
    expect(container.querySelector("linearGradient#progressGradient")).not.toBeNull();
  });

  it("残りカロリーの数値が緑色で表示される", () => {
    render(<TodayCalorie />);
    const remaining = screen.getByTestId("calorie-remaining");
    expect(remaining.className).toMatch(/text-green|calorie-remaining-value/);
  });

  it("モチベーションメッセージが表示される", () => {
    render(<TodayCalorie />);
    expect(screen.getByTestId("calorie-message")).toBeInTheDocument();
  });
});
