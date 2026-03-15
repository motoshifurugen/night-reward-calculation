# 02 — トップページの実装

> **ハンズオン形式です。**
> コードを写さず、タスクを読んで自分で書いてみましょう。
> 詰まったらヒントを開いてください。

---

## このチャプターで作るもの

未ログインユーザー向けのランディングページです。

```
┌─────────────────────────┐
│                         │
│   🍽️  NightReward       │
│                         │
│  今日の食事を記録して、  │
│  夜のご褒美をもっと      │
│  美味しく。             │
│                         │
│  [ G  Google でログイン ]│
│                         │
│  無料でご利用いただけます │
└─────────────────────────┘
```

---

## 事前知識

### React コンポーネントとは？

UI の部品を関数として書いたものです。

```tsx
// コンポーネントの基本形
export default function MyComponent() {
  return <div>Hello</div>;
}
```

### Props とは？

コンポーネントに外から値や処理を渡す仕組みです。

```tsx
// Props の型を定義する
type Props = {
  name: string;
  onClick: () => void;
};

// Props を受け取る
export default function MyComponent({ name, onClick }: Props) {
  return <button onClick={onClick}>{name}</button>;
}

// 使う側
<MyComponent name="送信" onClick={() => alert("clicked")} />
```

### TDD（Red → Green → Refactor）

```
1. RED    : 失敗するテストを書く
2. GREEN  : テストが通る最小の実装をする
3. REFACTOR: コードを整理する
```

---

## タスク

### タスク 1: テストファイルを作る（RED）

以下のファイルを作成してください。

**ファイル:** `src/components/landing/HeroSection.test.tsx`

テストで確認すること：
- 「NightReward」というテキストが画面に表示される
- 「Google でログイン」というボタンが表示される
- ボタンをクリックすると、Props で渡した `onLogin` 関数が呼ばれる

```bash
pnpm test  # → エラーになることを確認（RED）
```

<details>
<summary>ヒント: テストの書き方</summary>

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  it("○○が表示される", () => {
    render(<HeroSection onLogin={() => {}} />);
    expect(screen.getByText("○○")).toBeInTheDocument();
  });
});
```

- `render()` — コンポーネントを仮想 DOM に描画する
- `screen.getByText("テキスト")` — テキストで要素を探す
- `screen.getByRole("button", { name: /ボタン名/i })` — ボタンをラベルで探す
- `toBeInTheDocument()` — 画面に存在することを確認する
- `vi.fn()` — 呼ばれたか確認できるモック関数を作る

</details>

---

### タスク 2: コンポーネントを実装する（GREEN）

**ファイル:** `src/components/landing/HeroSection.tsx`

以下の条件を満たすコンポーネントを作ってください。

- Props として `onLogin: () => void` を受け取る
- アプリ名「NightReward」を表示する
- ボタンを表示し、クリックで `onLogin` を呼ぶ
- スタイルは Tailwind CSS で自由につけてよい

```bash
pnpm test  # → GREEN になることを確認
```

<details>
<summary>ヒント: コンポーネントの最小構成</summary>

```tsx
type HeroSectionProps = {
  onLogin: () => void;
};

export default function HeroSection({ onLogin }: HeroSectionProps) {
  return (
    <section>
      <h1>NightReward</h1>
      <button onClick={onLogin}>Google でログイン</button>
    </section>
  );
}
```

テストが通ったら、Tailwind で見た目を整えましょう。
`docs/ux.md` のカラーパレットを参考にしてください。

</details>

---

### タスク 3: トップページに組み込む

**ファイル:** `src/app/page.tsx`

以下の条件を満たすページを作ってください。

- `"use client"` を先頭に書く（Next.js のクライアントコンポーネント宣言）
- `useRouter` を使って、ログイン後に `/dashboard` へ遷移する
- `useAuthStore` の `login` を呼んでダミーログインする（uid, displayName, email を渡す）
- `HeroSection` を使って画面を表示する

```bash
pnpm dev  # → http://localhost:3000 を開いてボタンが動くか確認
```

<details>
<summary>ヒント: useRouter の使い方</summary>

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");  // /dashboard へ移動する
  };

  return <button onClick={handleClick}>移動</button>;
}
```

</details>

<details>
<summary>ヒント: useAuthStore の使い方</summary>

```tsx
import { useAuthStore } from "@/store/authStore";

// ストアから login 関数を取り出す
const login = useAuthStore((state) => state.login);

// ダミーユーザーでログイン
login({
  uid: "dummy-uid-001",
  displayName: "テストユーザー",
  email: null,
});
```

</details>

---

## 答え合わせ

実装が終わったら、見本コードと比べてみましょう。

```bash
# 見本コードを確認する
git show feat/21-initial-setup-top-page-dashboard:src/components/landing/HeroSection.tsx
git show feat/21-initial-setup-top-page-dashboard:src/app/page.tsx
```

---

## 理解チェック

- [ ] `render()` と `screen` の役割を自分の言葉で説明できる
- [ ] Props を使って処理を外から渡すメリットを説明できる（テストのしやすさ）
- [ ] `"use client"` が必要な理由を説明できる
- [ ] テストが RED → GREEN に変わった体験ができた

---

## 次のステップ

[03-dashboard.md](./03-dashboard.md) — Zustand（状態管理）+ ダッシュボードの実装
