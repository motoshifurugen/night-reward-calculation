# 02 — トップページの実装

> このガイドでは、未ログインユーザー向けのランディングページを
> TDD（テスト駆動開発）で実装する方法を解説します。

---

## TDD とは？

TDD は **Red → Green → Refactor** のサイクルで開発します。

```
1. RED    : まず失敗するテストを書く
2. GREEN  : テストが通る最小の実装をする
3. REFACTOR: コードを整理する（テストはそのまま通す）
```

「先にテストを書く」ことで、何を作るかが明確になります。

---

## ファイル構成

```
src/
├── app/
│   └── page.tsx                         # トップページのルート（"use client"）
└── components/
    └── landing/
        ├── HeroSection.tsx              # UI コンポーネント
        └── HeroSection.test.tsx         # テスト
```

---

## Step 1: テストを書く（RED）

`src/components/landing/HeroSection.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  it("アプリ名が表示される", () => {
    render(<HeroSection onLogin={() => {}} />);
    expect(screen.getByText("NightReward")).toBeInTheDocument();
  });

  it("Google ログインボタンが表示される", () => {
    render(<HeroSection onLogin={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Google でログイン/i })
    ).toBeInTheDocument();
  });
});
```

**ポイント:**
- `render()` でコンポーネントを仮想 DOM に描画する
- `screen.getByText()` でテキストを探す
- `screen.getByRole()` でボタンなどの役割で探す
- `toBeInTheDocument()` で画面に存在することを確認する

テストを実行すると、`HeroSection` がないのでエラーになります → **RED**

```bash
pnpm test  # → エラー（これが正常！）
```

---

## Step 2: 実装する（GREEN）

`src/components/landing/HeroSection.tsx`

```tsx
type HeroSectionProps = {
  onLogin: () => void;  // 親からログイン処理を受け取る
};

export default function HeroSection({ onLogin }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <h1>NightReward</h1>
      <button onClick={onLogin}>Google でログイン</button>
    </section>
  );
}
```

**ポイント:**
- Props（`onLogin`）で処理を外から渡す → テストしやすくなる
- Tailwind CSS のクラスでスタイリング

```bash
pnpm test  # → 全テスト GREEN
```

---

## Step 3: トップページにつなぐ

`src/app/page.tsx`

```tsx
"use client";  // ← Next.js で useState / useRouter を使うには必要

import { useRouter } from "next/navigation";
import HeroSection from "@/components/landing/HeroSection";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login({ uid: "dummy-uid-001", displayName: "テストユーザー", email: null });
    router.push("/dashboard");  // ダッシュボードに遷移
  };

  return <HeroSection onLogin={handleLogin} />;
}
```

**ポイント:**
- `"use client"` — このファイルはクライアント側で動く（ブラウザ）
- `useRouter()` — ページ遷移をプログラムで行う
- `useAuthStore()` — Zustand でログイン状態を管理する（次章で解説）

---

## 理解チェック

- [ ] `render()` と `screen` の役割を説明できる
- [ ] Props を使って処理を外から渡すメリットを説明できる
- [ ] `"use client"` が必要な理由を説明できる

---

## 次のステップ

- [03-dashboard.md](./03-dashboard.md) — ダッシュボードと Zustand の解説
