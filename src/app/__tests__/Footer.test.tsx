import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("'ホーム' ラベルが表示される", () => {
    render(<Footer />);
    expect(screen.getByText("ホーム")).toBeInTheDocument();
  });

  it("'献立' ラベルが表示される", () => {
    render(<Footer />);
    expect(screen.getByText("献立")).toBeInTheDocument();
  });

  it("'設定' ラベルが表示される", () => {
    render(<Footer />);
    expect(screen.getByText("設定")).toBeInTheDocument();
  });

  it("各ナビ項目に data-testid が存在する", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-home")).toBeInTheDocument();
    expect(screen.getByTestId("footer-menu")).toBeInTheDocument();
    expect(screen.getByTestId("footer-settings")).toBeInTheDocument();
  });

  it("デフォルトで 'ホーム' がアクティブ状態である", () => {
    render(<Footer />);
    const homeItem = screen.getByTestId("footer-home");
    expect(homeItem).toHaveAttribute("data-active", "true");
  });

  it("active prop で指定した項目がアクティブになる", () => {
    render(<Footer active="menu" />);
    expect(screen.getByTestId("footer-menu")).toHaveAttribute("data-active", "true");
    expect(screen.getByTestId("footer-home")).toHaveAttribute("data-active", "false");
  });

  it("footer 要素として描画される", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
