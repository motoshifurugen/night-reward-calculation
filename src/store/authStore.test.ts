import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./authStore";

// Zustand ストアの状態をテスト間でリセットするユーティリティ
const resetStore = () => useAuthStore.setState({ user: null, isLoggedIn: false });

describe("useAuthStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("初期状態: ユーザーはログアウトしている", () => {
    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
  });

  it("login() を呼ぶとログイン状態になる", () => {
    const store = useAuthStore.getState();
    store.login({ uid: "uid-001", displayName: "田中 太郎", email: null });

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.user?.uid).toBe("uid-001");
    expect(state.user?.displayName).toBe("田中 太郎");
  });

  it("logout() を呼ぶとログアウト状態になる", () => {
    const store = useAuthStore.getState();
    store.login({ uid: "uid-001", displayName: "田中 太郎", email: null });
    store.logout();

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
  });
});
