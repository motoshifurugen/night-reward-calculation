# 03 — ダッシュボードと状態管理（Zustand）

> このガイドでは、ログイン後のダッシュボード画面と、
> Zustand を使ったグローバルな状態管理を解説します。

---

## Zustand とは？

**Zustand** は React のシンプルな状態管理ライブラリです。

```
useState  → コンポーネント内だけで使えるローカルな状態
Zustand   → どのコンポーネントからでも読み書きできるグローバルな状態
```

ログイン状態（「誰がログインしているか」）は複数の画面で使うので、
Zustand で管理します。

---

## ファイル構成

```
src/
├── store/
│   ├── authStore.ts       # 認証状態の定義と操作
│   └── authStore.test.ts  # ストアのテスト
└── components/
    └── dashboard/
        ├── DashboardView.tsx
        └── DashboardView.test.tsx
```

---

## Step 1: ストアのテストを書く（RED）

`src/store/authStore.test.ts`

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./authStore";

// テストごとにストアをリセット
const resetStore = () =>
  useAuthStore.setState({ user: null, isLoggedIn: false });

describe("useAuthStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("初期状態はログアウト", () => {
    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
  });

  it("login() でログイン状態になる", () => {
    useAuthStore.getState().login({
      uid: "uid-001",
      displayName: "田中 太郎",
      email: null,
    });
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
  });

  it("logout() でログアウト状態になる", () => {
    useAuthStore.getState().login({ uid: "uid-001", displayName: "田中", email: null });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
  });
});
```

**ポイント:**
- `beforeEach()` でテストごとにストアをリセットする（テスト間の干渉を防ぐ）
- `useAuthStore.getState()` でストアのメソッドを直接呼べる

---

## Step 2: ストアを実装する（GREEN）

`src/store/authStore.ts`

```ts
import { create } from "zustand";

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

  // set() で状態を更新する
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));
```

**ポイント:**
- `create()` でストアを作成する
- `set()` で状態を更新する（React の setState に相当）
- 型定義（`AuthState`）で状態の形を明示する

---

## Step 3: コンポーネントのテストを書く（RED）

`src/components/dashboard/DashboardView.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import DashboardView from "./DashboardView";

const mockUser = { uid: "uid-001", displayName: "田中 太郎", email: null };

describe("DashboardView", () => {
  it("ユーザー名が表示される", () => {
    render(<DashboardView user={mockUser} onLogout={() => {}} />);
    expect(screen.getByText(/田中 太郎/)).toBeInTheDocument();
  });

  it("空状態メッセージが表示される", () => {
    render(<DashboardView user={mockUser} onLogout={() => {}} />);
    expect(screen.getByText(/今日の記録はまだありません/)).toBeInTheDocument();
  });
});
```

---

## Step 4: ダッシュボードを実装する（GREEN）

`src/components/dashboard/DashboardView.tsx`

```tsx
import type { AuthUser } from "@/store/authStore";

type DashboardViewProps = {
  user: AuthUser;
  onLogout: () => void;
};

export default function DashboardView({ user, onLogout }: DashboardViewProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold">NightReward</h1>
        <button onClick={onLogout}>ログアウト</button>
      </header>
      <main className="px-4 py-6">
        <p>{user.displayName} さん</p>
        <p>今日の記録はまだありません</p>
        <button>食事を記録する</button>
      </main>
    </div>
  );
}
```

---

## Step 5: ページに組み込む

`src/app/dashboard/page.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardView from "@/components/dashboard/DashboardView";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  // 未ログインならトップへリダイレクト
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) return null;

  return (
    <DashboardView
      user={user}
      onLogout={() => {
        logout();
        router.replace("/");
      }}
    />
  );
}
```

**ポイント:**
- `useEffect()` — レンダリング後に副作用（リダイレクト）を実行する
- 未ログインユーザーを保護する（ガード処理）

---

## ダミーログインから Firebase に移行するには？

現在は Zustand にダミーデータをセットしているだけです。
Firebase を導入したら、`page.tsx` の `handleLogin` 関数を以下のように差し替えます。

```ts
// 現在（ダミー）
const handleLogin = () => {
  login({ uid: "dummy-uid-001", displayName: "テストユーザー", email: null });
  router.push("/dashboard");
};

// Firebase 導入後
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  login({
    uid: result.user.uid,
    displayName: result.user.displayName,
    email: null,  // メールアドレスは保存しない（docs/data.md 参照）
  });
  router.push("/dashboard");
};
```

---

## 理解チェック

- [ ] Zustand と useState の違いを説明できる
- [ ] `create()` と `set()` の役割を説明できる
- [ ] `useEffect()` が必要な理由を説明できる
- [ ] ダミーログインを Firebase に差し替えるイメージができる
