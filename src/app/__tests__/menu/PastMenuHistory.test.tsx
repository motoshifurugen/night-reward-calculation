import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PastMenuHistory from "../../menu/PastMenuHistory";

describe("PastMenuHistory", () => {
  it("'過去の献立' タイトルが表示される", () => {
    render(<PastMenuHistory />);
    expect(screen.getByText("過去の献立")).toBeInTheDocument();
  });

  it("'すべて見る' リンクが表示される", () => {
    render(<PastMenuHistory />);
    expect(screen.getByText("すべて見る")).toBeInTheDocument();
  });

  it("2件の献立エントリが表示される", () => {
    render(<PastMenuHistory />);
    const entries = screen.getAllByTestId("meal-history-entry");
    expect(entries).toHaveLength(2);
  });

  it("各エントリにカロリーが表示される", () => {
    render(<PastMenuHistory />);
    // 直近2日: 2026-07-31(1,864kcal), 2026-07-30(1,682kcal)
    expect(screen.getByText(/1,864/)).toBeInTheDocument();
    expect(screen.getByText(/1,682/)).toBeInTheDocument();
  });

  it("全食事が登録済みのためアイコンは表示されない", () => {
    render(<PastMenuHistory />);
    // 直近2日(06-15, 06-16)は全食事登録済み → アイコンなし
    expect(screen.queryAllByTestId("icon-breakfast")).toHaveLength(0);
    expect(screen.queryAllByTestId("icon-lunch")).toHaveLength(0);
    expect(screen.queryAllByTestId("icon-dinner")).toHaveLength(0);
  });

  it("背景がライムグラデーションである", () => {
    render(<PastMenuHistory />);
    const section = screen.getByTestId("past-menu-history");
    expect(section.className).toContain("bg-linear");
    expect(section.className).toContain("to-lime-200");
  });

  it("登録済みの食事はメイン料理の画像が表示される", () => {
    render(<PastMenuHistory />);
    const mainImages = screen.getAllByTestId("main-dish-image");
    expect(mainImages.length).toBeGreaterThan(0);
    mainImages.forEach((img) => {
      expect(img).toHaveAttribute("src");
      expect(img).toHaveAttribute("alt");
    });
  });

  it("日付ブロックに薄いグレー背景がある", () => {
    render(<PastMenuHistory />);
    const dateBlocks = screen.getAllByTestId("date-block");
    expect(dateBlocks.length).toBeGreaterThan(0);
    dateBlocks.forEach((el) => expect(el.className).toContain("bg-gray-100"));
  });

  it("各エントリに曜日が表示される", () => {
    render(<PastMenuHistory />);
    // 2026-07-31 = 金曜日, 2026-07-30 = 木曜日
    expect(screen.getByText("金曜日")).toBeInTheDocument();
    expect(screen.getByText("木曜日")).toBeInTheDocument();
  });

  it("各エントリに月名が表示される", () => {
    render(<PastMenuHistory />);
    const dateBlocks = screen.getAllByTestId("date-block");
    // JUL が表示されること
    expect(dateBlocks.some((el) => el.textContent?.includes("JUL"))).toBe(true);
  });
});
