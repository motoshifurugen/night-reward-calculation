import { describe, it, expect } from "vitest";
import { buildUpcomingDates, formatDayLabel } from "../upcomingMenu";

describe("buildUpcomingDates", () => {
  it("翌日から count 件の日付配列を返す", () => {
    const result = buildUpcomingDates("2026-06-24", 8);
    expect(result).toHaveLength(8);
    expect(result[0]).toBe("2026-06-25");
    expect(result[7]).toBe("2026-07-02");
  });

  it("月をまたぐ場合も正しく計算される", () => {
    const result = buildUpcomingDates("2026-06-28", 8);
    expect(result[1]).toBe("2026-06-30");
    expect(result[2]).toBe("2026-07-01");
    expect(result[7]).toBe("2026-07-06");
  });

  it("年をまたぐ場合も正しく計算される", () => {
    const result = buildUpcomingDates("2026-12-30", 4);
    expect(result[0]).toBe("2026-12-31");
    expect(result[1]).toBe("2027-01-01");
    expect(result[3]).toBe("2027-01-03");
  });

  it("count=0 の場合は空配列を返す", () => {
    expect(buildUpcomingDates("2026-06-24", 0)).toEqual([]);
  });

  it("各日付は YYYY-MM-DD 形式", () => {
    const result = buildUpcomingDates("2026-06-24", 3);
    result.forEach((d) => expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/));
  });

  it("月・日は2桁ゼロ埋め", () => {
    const result = buildUpcomingDates("2026-12-30", 3);
    expect(result[1]).toBe("2027-01-01");
  });
});

describe("formatDayLabel", () => {
  it("日付から day と weekday を返す", () => {
    expect(formatDayLabel("2026-06-25")).toEqual({ day: 25, weekday: "木" });
  });

  it("日曜日は '日' を返す", () => {
    expect(formatDayLabel("2026-08-02")).toEqual({ day: 2, weekday: "日" });
  });

  it("土曜日は '土' を返す", () => {
    expect(formatDayLabel("2026-08-01")).toEqual({ day: 1, weekday: "土" });
  });

  it("月を正しく識別する（1月）", () => {
    expect(formatDayLabel("2027-01-01")).toEqual({ day: 1, weekday: "金" });
  });
});
