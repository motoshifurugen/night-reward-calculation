import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  it("アプリ名が表示される", () => {
    render(<HeroSection onLogin={() => {}} />);
    expect(screen.getByText("NightReward")).toBeInTheDocument();
  });

  it("キャッチコピーが表示される", () => {
    render(<HeroSection onLogin={() => {}} />);
    expect(
      screen.getByText(/今日の食事を記録して、夜のご褒美を/i)
    ).toBeInTheDocument();
  });

  it("Google ログインボタンが表示される", () => {
    render(<HeroSection onLogin={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Google でログイン/i })
    ).toBeInTheDocument();
  });

  it("ログインボタンをクリックすると onLogin が呼ばれる", async () => {
    const mockLogin = vi.fn();
    render(<HeroSection onLogin={mockLogin} />);

    const button = screen.getByRole("button", { name: /Google でログイン/i });
    button.click();

    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});
