import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WeeklyMenu from "../../home/WeeklyMenu";

describe("WeeklyMenu", () => {
  it("タイトル「今週の献立」が表示される", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    expect(screen.getByText("今週の献立")).toBeInTheDocument();
  });

  it("「詳細を見る」リンクが表示される", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    expect(screen.getByText(/詳細を見る/)).toBeInTheDocument();
  });

  it("7つの日付カラムが表示される", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    const columns = screen.getAllByTestId(/^day-col-/);
    expect(columns).toHaveLength(7);
  });

  it("今日のカラムが data-today='true' を持つ", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    const todayCol = screen.getByTestId("day-col-2026-06-04");
    expect(todayCol).toHaveAttribute("data-today", "true");
  });

  it("今日以外のカラムは data-today='false' を持つ", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    const otherCol = screen.getByTestId("day-col-2026-06-05");
    expect(otherCol).toHaveAttribute("data-today", "false");
  });

  it("登録済み食事には画像が表示される", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    const images = screen.getAllByTestId(/^meal-img-/);
    expect(images.length).toBeGreaterThan(0);
  });

  it("未登録の食事にはアイコンが表示される", () => {
    // today=2026-07-28: 週範囲 2026-07-28〜08-03、2026-08-01以降はデータなし
    render(<WeeklyMenu today="2026-07-28" />);
    const icons = screen.getAllByTestId(/^meal-icon-/);
    expect(icons.length).toBeGreaterThan(0);
  });

  it("献立があるの日にはカロリー数値が表示される", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    // 2026-06-04: 朝(252+36)+昼(500+200)+夜(300+82) = 1,370 kcal
    expect(screen.getByTestId("day-cal-2026-06-04")).toHaveTextContent("1,370");
  });

  it("献立がない日には「-」が表示される", () => {
    // today=2026-07-28: 2026-08-01はデータなし
    render(<WeeklyMenu today="2026-07-28" />);
    expect(screen.getByTestId("day-cal-2026-08-01")).toHaveTextContent("-");
  });

  it("今週の平均カロリーが表示される", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    expect(screen.getByTestId("weekly-avg")).toBeInTheDocument();
  });

  it("曜日が日本語で表示される", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    // 2026-06-04 は木曜日
    expect(screen.getByTestId("day-col-2026-06-04")).toHaveTextContent("木");
  });

  it("7日グリッドに横スクロールがない", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    const grid = screen.getByTestId("weekly-grid");
    expect(grid.className).not.toMatch(/overflow-x-auto/);
  });

  it("各日カラムが均等幅クラス（flex-1）を持つ", () => {
    render(<WeeklyMenu today="2026-06-04" />);
    const columns = screen.getAllByTestId(/^day-col-/);
    columns.forEach((col) => {
      expect(col.className).toMatch(/flex-1/);
    });
  });

  it("未登録の朝食アイコン円形コンテナが bg-orange-100 を持つ", () => {
    const { container } = render(<WeeklyMenu today="2026-07-28" />);
    container.querySelectorAll('[data-testid="meal-icon-breakfast"]').forEach((el) => {
      expect(el.querySelector(".rounded-full")?.className).toMatch(/bg-orange-100/);
    });
  });

  it("未登録の昼食アイコン円形コンテナが bg-green-100 を持つ", () => {
    const { container } = render(<WeeklyMenu today="2026-07-28" />);
    container.querySelectorAll('[data-testid="meal-icon-lunch"]').forEach((el) => {
      expect(el.querySelector(".rounded-full")?.className).toMatch(/bg-green-100/);
    });
  });

  it("未登録の夕食アイコン円形コンテナが bg-blue-100 を持つ", () => {
    const { container } = render(<WeeklyMenu today="2026-07-28" />);
    container.querySelectorAll('[data-testid="meal-icon-dinner"]').forEach((el) => {
      expect(el.querySelector(".rounded-full")?.className).toMatch(/bg-blue-100/);
    });
  });

  it("未登録セルに表示されるアイコンは食事タイプアイコン1つのみ（Utensils なし）", () => {
    const { container } = render(<WeeklyMenu today="2026-07-28" />);
    const cell = container.querySelector('[data-testid="meal-icon-breakfast"]');
    const svgs = cell?.querySelectorAll("svg");
    expect(svgs?.length).toBe(1);
  });

  it("未登録セルのアイコンが rounded-full の円形コンテナに包まれている", () => {
    const { container } = render(<WeeklyMenu today="2026-07-28" />);
    const cell = container.querySelector('[data-testid="meal-icon-breakfast"]');
    const circle = cell?.querySelector(".rounded-full");
    expect(circle).not.toBeNull();
  });

  it("円形コンテナに食事タイプのbgカラーが適用されている（外側セルではなく円の中）", () => {
    const { container } = render(<WeeklyMenu today="2026-07-28" />);
    const cell = container.querySelector('[data-testid="meal-icon-breakfast"]');
    const circle = cell?.querySelector(".rounded-full");
    expect(circle?.className).toMatch(/bg-orange-100/);
  });
});
