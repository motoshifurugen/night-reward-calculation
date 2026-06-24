import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuCalendar from "../../menu/MenuCalendar";

// today=2026-06-24
// 2026-06-03: count=3 → green number + dot
// 2026-06-01: count=0 → no indicator
// 2026-06-24: today → amber背景

describe("MenuCalendar", () => {
  it("'カレンダー' タイトルが表示される", () => {
    render(<MenuCalendar today="2026-06-24" />);
    expect(screen.getByText("カレンダー")).toBeInTheDocument();
  });

  it("年月ラベルが '2026年6月' として表示される", () => {
    render(<MenuCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-month-label")).toHaveTextContent("2026年6月");
  });

  it("曜日ヘッダーが7列表示される", () => {
    render(<MenuCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-weekday-header").children).toHaveLength(7);
  });

  it("前月ボタンが存在する", () => {
    render(<MenuCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-prev-btn")).toBeInTheDocument();
  });

  it("次月ボタンが存在する", () => {
    render(<MenuCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-next-btn")).toBeInTheDocument();
  });

  it("次月ボタンクリックで '2026年7月' に変わる", () => {
    render(<MenuCalendar today="2026-06-24" />);
    fireEvent.click(screen.getByTestId("calendar-next-btn"));
    expect(screen.getByTestId("calendar-month-label")).toHaveTextContent("2026年7月");
  });

  it("前月ボタンクリックで '2026年5月' に変わる", () => {
    render(<MenuCalendar today="2026-06-24" />);
    fireEvent.click(screen.getByTestId("calendar-prev-btn"));
    expect(screen.getByTestId("calendar-month-label")).toHaveTextContent("2026年5月");
  });

  it("今日のセルに data-today='true' が付与される", () => {
    render(<MenuCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-cell-2026-06-24")).toHaveAttribute(
      "data-today",
      "true"
    );
  });

  it("count=3 の日付に data-meal-count='3' が付与される", () => {
    render(<MenuCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-cell-2026-06-03")).toHaveAttribute(
      "data-meal-count",
      "3"
    );
  });

  it("count=0 の日付に data-meal-count='0' が付与される", () => {
    render(<MenuCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-cell-2026-06-01")).toHaveAttribute(
      "data-meal-count",
      "0"
    );
  });

  it("count=3 の日付には dot インジケータが表示される", () => {
    render(<MenuCalendar today="2026-06-24" />);
    const cell = screen.getByTestId("calendar-cell-2026-06-03");
    expect(cell.querySelector("[data-testid='meal-dot']")).toBeInTheDocument();
  });

  it("count=0 の日付には dot インジケータが表示されない", () => {
    render(<MenuCalendar today="2026-06-24" />);
    const cell = screen.getByTestId("calendar-cell-2026-06-01");
    expect(cell.querySelector("[data-testid='meal-dot']")).not.toBeInTheDocument();
  });

  it("12月から前月に進むと年が変わる", () => {
    render(<MenuCalendar today="2026-01-01" />);
    fireEvent.click(screen.getByTestId("calendar-prev-btn"));
    expect(screen.getByTestId("calendar-month-label")).toHaveTextContent("2025年12月");
  });

  it("12月から次月に進むと年が変わる", () => {
    render(<MenuCalendar today="2026-12-01" />);
    fireEvent.click(screen.getByTestId("calendar-next-btn"));
    expect(screen.getByTestId("calendar-month-label")).toHaveTextContent("2027年1月");
  });
});
