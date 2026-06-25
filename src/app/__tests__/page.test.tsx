import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("../utility/Navbar", () => ({
  default: ({ variant }: { variant?: string }) => (
    <div data-testid="mock-navbar" data-variant={variant} />
  ),
}));

vi.mock("../home/TodayCalorie", () => ({
  default: () => <div data-testid="mock-today-calorie" />,
}));

vi.mock("../home/WeeklyMenu", () => ({
  default: () => <div data-testid="mock-weekly-menu" />,
}));

vi.mock("../home/WeeklyProgress", () => ({
  default: () => <div data-testid="mock-weekly-progress" />,
}));

vi.mock("../home/MonthCalendar", () => ({
  default: () => <div data-testid="mock-month-calendar" />,
}));

vi.mock("../utility/Footer", () => ({
  default: () => <div data-testid="mock-footer" />,
}));

import Page from "../page";

describe("Root Page (/)", () => {
  it("Navbarがhomeバリアントで描画される", () => {
    render(<Page />);
    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-navbar")).toHaveAttribute(
      "data-variant",
      "home"
    );
  });

  it("TodayCalorieが描画される", () => {
    render(<Page />);
    expect(screen.getByTestId("mock-today-calorie")).toBeInTheDocument();
  });

  it("WeeklyMenuが描画される", () => {
    render(<Page />);
    expect(screen.getByTestId("mock-weekly-menu")).toBeInTheDocument();
  });

  it("WeeklyProgressが描画される", () => {
    render(<Page />);
    expect(screen.getByTestId("mock-weekly-progress")).toBeInTheDocument();
  });

  it("Footerが描画される", () => {
    render(<Page />);
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("mainコンポーネントの描画順序が正しい (Navbar→TodayCalorie→WeeklyProgress→WeeklyMenu)", () => {
    const { container } = render(<Page />);
    const main = container.querySelector("main");
    const order = Array.from(main!.children).map((el) =>
      el.getAttribute("data-testid")
    );
    expect(order).toEqual([
      "mock-navbar",
      "mock-today-calorie",
      "mock-weekly-progress",
      "mock-weekly-menu",
      "mock-month-calendar",
    ]);
  });
});
