import { create } from "zustand";

// ユーザー型（Firebase Auth の User を参考にした最小構成）
// Firebase 接続時は FirebaseUser 型に差し替える
export type AuthUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
};

type AuthState = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  login: (user) => set({ user, isLoggedIn: true }),

  logout: () => set({ user: null, isLoggedIn: false }),
}));
