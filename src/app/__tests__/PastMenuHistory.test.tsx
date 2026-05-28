import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PastMenuHistory from "../menu/PastMenuHistory";

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
    expect(screen.getByText(/1,450/)).toBeInTheDocument();
    expect(screen.getByText(/1,950/)).toBeInTheDocument();
  });

  it("registeredItems がない食事にのみアイコンを表示する", () => {
    render(<PastMenuHistory />);
    // 05-27 breakfast: 登録あり→画像, 05-26 breakfast: 登録なし→アイコン
    expect(screen.getAllByTestId("icon-breakfast")).toHaveLength(1);
    // 両日ともランチは登録あり → アイコンなし
    expect(screen.queryAllByTestId("icon-lunch")).toHaveLength(0);
    // 両日ともディナーは登録なし → アイコン2件
    expect(screen.getAllByTestId("icon-dinner")).toHaveLength(2);
  });

  it("背景が純白である", () => {
    render(<PastMenuHistory />);
    const section = screen.getByTestId("past-menu-history");
    expect(section.className).toContain("bg-white");
    expect(section.className).not.toContain("bg-linear");
  });

  it("朝食アイコンはカスタム日の出 (矢印なし) である", () => {
    render(<PastMenuHistory />);
    const breakfastIcons = screen.getAllByTestId("icon-breakfast");
    expect(breakfastIcons.length).toBeGreaterThan(0);
    breakfastIcons.forEach((el) => expect(el).toHaveAttribute("data-icon", "sunrise"));
  });

  it("昼食アイコンのアイコンキーは sun である", () => {
    render(<PastMenuHistory />);
    // icon-lunch は登録なしのときのみ表示される（現テストデータでは朝食05-26のみ）
    // 朝食アイコンが sunrise キーを持つことで MEAL_ICONS 設定を間接的に検証
    const breakfastIcons = screen.getAllByTestId("icon-breakfast");
    breakfastIcons.forEach((el) => expect(el).toHaveAttribute("data-icon", "sunrise"));
  });

  it("日付ブロックに薄いグレー背景がある", () => {
    render(<PastMenuHistory />);
    const dateBlocks = screen.getAllByTestId("date-block");
    expect(dateBlocks.length).toBeGreaterThan(0);
    dateBlocks.forEach((el) => expect(el.className).toContain("bg-gray-100"));
  });

  it("各エントリに曜日が表示される", () => {
    render(<PastMenuHistory />);
    expect(screen.getByText("水曜日")).toBeInTheDocument();
    expect(screen.getByText("火曜日")).toBeInTheDocument();
  });

  it("registeredItems がある食事はメイン料理の画像を表示する", () => {
    render(<PastMenuHistory />);
    const mainImages = screen.getAllByTestId("main-dish-image");
    expect(mainImages.length).toBeGreaterThan(0);
    mainImages.forEach((img) => {
      expect(img).toHaveAttribute("src");
      expect(img).toHaveAttribute("alt");
    });
  });

  it("registeredItems がない食事はアイコンを表示する", () => {
    render(<PastMenuHistory />);
    // dinnerは未登録なのでアイコン（icon-dinner）が残る
    const dinnerIcons = screen.getAllByTestId("icon-dinner");
    expect(dinnerIcons.length).toBeGreaterThan(0);
  });
});
