import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MonthCalendar from "../../home/MonthCalendar";

describe("MonthCalendar", () => {
  it("'今月の記録状況' タイトルが表示される", () => {
    render(<MonthCalendar today="2026-06-24" />);
    expect(screen.getByText("今月の記録状況")).toBeInTheDocument();
  });

  it("年月が '2026年6月' として表示される", () => {
    render(<MonthCalendar today="2026-06-24" />);
    expect(screen.getByText("2026年6月")).toBeInTheDocument();
  });

  it("曜日ヘッダーが7列表示される", () => {
    render(<MonthCalendar today="2026-06-24" />);
    const headers = screen.getByTestId("calendar-weekday-header");
    expect(headers.children).toHaveLength(7);
  });

  it("今日のセルに data-today 属性が付与される", () => {
    render(<MonthCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-day-2026-06-24")).toHaveAttribute(
      "data-today",
      "true"
    );
  });

  it("データなし過去日（06-01）は danger ステータス", () => {
    render(<MonthCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-day-2026-06-01")).toHaveAttribute(
      "data-status",
      "danger"
    );
  });

  it("全食事登録済みの過去日（06-03）は health ステータス", () => {
    render(<MonthCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-day-2026-06-03")).toHaveAttribute(
      "data-status",
      "health"
    );
  });

  it("データあり未来日（06-25）は health ステータス", () => {
    render(<MonthCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-day-2026-06-25")).toHaveAttribute(
      "data-status",
      "health"
    );
  });

  it("日付の数字が表示される", () => {
    render(<MonthCalendar today="2026-06-24" />);
    expect(screen.getByTestId("calendar-day-2026-06-01")).toHaveTextContent("1");
    expect(screen.getByTestId("calendar-day-2026-06-30")).toHaveTextContent("30");
  });
});
