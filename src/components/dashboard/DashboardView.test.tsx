import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardView from "./DashboardView";

const mockUser = {
  uid: "uid-001",
  displayName: "田中 太郎",
  email: null,
};

describe("DashboardView", () => {
  it("ユーザー名が表示される", () => {
    render(<DashboardView user={mockUser} onLogout={() => {}} />);
    expect(screen.getByText(/田中 太郎/i)).toBeInTheDocument();
  });

  it("今日のカロリー（空状態）が表示される", () => {
    render(<DashboardView user={mockUser} onLogout={() => {}} />);
    expect(screen.getByText(/今日の記録はまだありません/i)).toBeInTheDocument();
  });

  it("「+ 食事を記録する」ボタンが表示される", () => {
    render(<DashboardView user={mockUser} onLogout={() => {}} />);
    expect(
      screen.getByRole("button", { name: /食事を記録する/i })
    ).toBeInTheDocument();
  });

  it("ログアウトボタンが表示される", () => {
    render(<DashboardView user={mockUser} onLogout={() => {}} />);
    expect(
      screen.getByRole("button", { name: /ログアウト/i })
    ).toBeInTheDocument();
  });

  it("ログアウトボタンをクリックすると onLogout が呼ばれる", () => {
    const mockLogout = vi.fn();
    render(<DashboardView user={mockUser} onLogout={mockLogout} />);

    screen.getByRole("button", { name: /ログアウト/i }).click();
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
