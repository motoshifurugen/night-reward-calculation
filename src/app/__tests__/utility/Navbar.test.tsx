import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "../../utility/Navbar";

describe("Navbar - home variant", () => {
  it("'ホーム' タイトルが表示される", () => {
    render(<Navbar variant="home" />);
    expect(screen.getByText("ホーム")).toBeInTheDocument();
  });

  it("今日の日付が表示される", () => {
    render(<Navbar variant="home" />);
    expect(screen.getByTestId("home-date")).toBeInTheDocument();
  });

  it("ベルボタンが表示される", () => {
    render(<Navbar variant="home" />);
    expect(screen.getByTestId("bell-button")).toBeInTheDocument();
  });

  it("header 要素として描画される", () => {
    render(<Navbar variant="home" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});

describe("Navbar - menu variant", () => {
  it("'献立' タイトルが表示される", () => {
    render(<Navbar variant="menu" />);
    expect(screen.getByText("献立")).toBeInTheDocument();
  });

  it("戻るリンクが存在する", () => {
    render(<Navbar variant="menu" />);
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("戻るリンクがホームへ遷移する href を持つ", () => {
    render(<Navbar variant="menu" />);
    expect(screen.getByTestId("back-button")).toHaveAttribute("href", "/");
  });

  it("header 要素として描画される", () => {
    render(<Navbar variant="menu" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("タイトルが font-bold クラスを持つ", () => {
    render(<Navbar variant="menu" />);
    expect(screen.getByRole("heading")).toHaveClass("font-bold");
  });

  it("タイトルが text-xl クラスを持つ", () => {
    render(<Navbar variant="menu" />);
    expect(screen.getByRole("heading")).toHaveClass("text-xl");
  });

  it("header が shadow-sm クラスを持つ", () => {
    render(<Navbar variant="menu" />);
    expect(screen.getByRole("banner")).toHaveClass("shadow-sm");
  });

  it("header が min-h-18 を持つ", () => {
    render(<Navbar variant="menu" />);
    expect(screen.getByRole("banner")).toHaveClass("min-h-18");
  });

  it("タイトルラッパーが absolute inset-0 justify-center で中央配置される", () => {
    render(<Navbar variant="menu" />);
    const wrapper = screen.getByTestId("menu-title-wrapper");
    expect(wrapper).toHaveClass("absolute");
    expect(wrapper).toHaveClass("inset-0");
    expect(wrapper).toHaveClass("justify-center");
  });
});
