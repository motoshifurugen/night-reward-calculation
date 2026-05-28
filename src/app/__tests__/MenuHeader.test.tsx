import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MenuHeader from "../menu/MenuHeader";

describe("MenuHeader", () => {
  it("'献立' タイトルが表示される", () => {
    render(<MenuHeader />);
    expect(screen.getByText("献立")).toBeInTheDocument();
  });

  it("戻るリンクが存在する", () => {
    render(<MenuHeader />);
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("戻るリンクがホームへ遷移する href を持つ", () => {
    render(<MenuHeader />);
    const backBtn = screen.getByTestId("back-button");
    expect(backBtn).toHaveAttribute("href", "/");
  });

  it("header 要素として描画される", () => {
    render(<MenuHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("タイトルが font-bold クラスを持つ（Navbar と同じフォント）", () => {
    render(<MenuHeader />);
    expect(screen.getByRole("heading")).toHaveClass("font-bold");
  });

  it("タイトルが text-xl クラスを持つ（Navbar と同じフォントサイズ）", () => {
    render(<MenuHeader />);
    expect(screen.getByRole("heading")).toHaveClass("text-xl");
  });

  it("header が shadow-sm クラスを持つ（Navbar と同じライン）", () => {
    render(<MenuHeader />);
    expect(screen.getByRole("banner")).toHaveClass("shadow-sm");
  });

  it("header が Navbar と同じ高さ（min-h-18 = 4.5rem）を持つ", () => {
    render(<MenuHeader />);
    expect(screen.getByRole("banner")).toHaveClass("min-h-18");
  });

  it("タイトルラッパーが inset-0 と justify-center で全幅中央配置される", () => {
    render(<MenuHeader />);
    const titleWrapper = screen.getByTestId("menu-title-wrapper");
    expect(titleWrapper).toHaveClass("absolute");
    expect(titleWrapper).toHaveClass("inset-0");
    expect(titleWrapper).toHaveClass("justify-center");
  });
});
