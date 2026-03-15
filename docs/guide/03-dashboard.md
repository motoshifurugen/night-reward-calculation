# 03 — ダッシュボードと状態管理（Zustand）

> **ハンズオン形式です。**
> コードを写さず、タスクを読んで自分で書いてみましょう。
> 詰まったらヒントを開いてください。

---

## このチャプターで作るもの

ログイン後のダッシュボード画面と、ログイン状態を管理するストアです。

```
┌─────────────────────────┐
│ NightReward   ログアウト │  ← ヘッダー
├─────────────────────────┤
│ おかえりなさい           │
│ 田中 太郎 さん           │  ← ウェルカムメッセージ
│                         │
│ ┌─────────────────────┐ │
│ │ 今日の摂取カロリー   │ │
│ │ 0 kcal             │ │  ← カロリーカード
│ └─────────────────────┘ │
│                         │
│   🍽️                    │
│   今日の記録はまだ        │
│   ありません             │  ← 空状態
│                         │
│   [ + 食事を記録する ]   │
└─────────────────────────┘
```

---

## 事前知識

### グローバルな状態とは？

`useState` はコンポーネント内だけで使える「ローカルな状態」です。
「誰がログインしているか」はどの画面からでも参照したいので、
**グローバルな状態**として管理する必要があります。

```
useState   → コンポーネントの中だけ
Zustand    → どこからでも読み書きできる
```

### Zustand の基本

```ts
import { create } from "zustand";

type CountState = {
  count: number;
  increment: () => void;
};

const useCountStore = create<CountState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// コンポーネントで使う
const count = useCountStore((state) => state.count);
const increment = useCountStore((state) => state.increment);
```

### useEffect とは？

レンダリングの後に実行される副作用を書く場所です。

```tsx
useEffect(() => {
  // ここに副作用を書く（リダイレクト、データ取得など）
}, [依存する値]);  // 依存する値が変わるたびに再実行される
```

---

## タスク

### タスク 1: AuthUser 型と authStore のテストを書く（RED）

**ファイル:** `src/store/authStore.test.ts`

テストで確認すること：
- 初期状態では `isLoggedIn` が `false` で `user` が `null` である
- `login()` を呼ぶと `isLoggedIn` が `true` になる
- `logout()` を呼ぶと `isLoggedIn` が `false` に戻る

```bash
pnpm test  # → エラーになることを確認（RED）
```

<details>
<summary>ヒント: Zustand ストアのテスト方法</summary>

```ts
import { useAuthStore } from "./authStore";

// テストごとにストアをリセットする関数
const resetStore = () =>
  useAuthStore.setState({ user: null, isLoggedIn: false });

describe("useAuthStore", () => {
  beforeEach(() => {
    resetStore();  // 各テストの前にリセット
  });

  it("初期状態はログアウト", () => {
    const state = useAuthStore.getState();  // ストアの状態を直接取得
    expect(state.isLoggedIn).toBe(false);
  });
});
```

- `useAuthStore.getState()` — フック外でストアの値を取得できる
- `useAuthStore.setState()` — フック外でストアの値を強制的に書き換えられる（テスト用）
- `beforeEach()` — 各テストの前に実行される処理

</details>

---

### タスク 2: authStore を実装する（GREEN）

**ファイル:** `src/store/authStore.ts`

以下の型と関数を持つストアを作ってください。

**型定義:**
```
AuthUser:
  uid: string
  displayName: string | null
  email: string | null
```

**ストアの状態:**
```
user: AuthUser | null  （初期値: null）
isLoggedIn: boolean    （初期値: false）
login(user): void      （user をセットして isLoggedIn を true にする）
logout(): void         （user を null にして isLoggedIn を false にする）
```

```bash
pnpm test  # → GREEN になることを確認
```

<details>
<summary>ヒント: create() の使い方</summary>

```ts
import { create } from "zustand";

type MyState = {
  value: string;
  setValue: (v: string) => void;
};

export const useMyStore = create<MyState>((set) => ({
  value: "",
  setValue: (v) => set({ value: v }),
}));
```

`set()` に新しい値を渡すと、ストアの状態が更新されます。
オブジェクトをそのまま渡せば OK です（変わらないフィールドはそのまま保たれます）。

</details>

---

### タスク 3: DashboardView のテストを書く（RED）

**ファイル:** `src/components/dashboard/DashboardView.test.tsx`

テストで確認すること：
- ユーザー名（`displayName`）が画面に表示される
- 「今日の記録はまだありません」という文字が表示される
- 「食事を記録する」ボタンが表示される
- 「ログアウト」ボタンをクリックすると `onLogout` が呼ばれる

```bash
pnpm test  # → エラーになることを確認（RED）
```

<details>
<summary>ヒント: テスト用のダミーユーザー</summary>

```tsx
const mockUser = {
  uid: "uid-001",
  displayName: "田中 太郎",
  email: null,
};

render(<DashboardView user={mockUser} onLogout={() => {}} />);
```

Props に直接ダミーのデータを渡すことで、ストアとは切り離してテストできます。

</details>

---

### タスク 4: DashboardView を実装する（GREEN）

**ファイル:** `src/components/dashboard/DashboardView.tsx`

以下の Props を受け取るコンポーネントを作ってください。

```
Props:
  user: AuthUser
  onLogout: () => void
```

画面の要素：
- ヘッダー（アプリ名 + ログアウトボタン）
- ウェルカムメッセージ（ユーザー名 + 「さん」）
- 今日のカロリー表示（0 kcal）
- 空状態メッセージ（「今日の記録はまだありません」）
- 「食事を記録する」ボタン

```bash
pnpm test  # → GREEN になることを確認
```

<details>
<summary>ヒント: AuthUser 型のインポート</summary>

```tsx
import type { AuthUser } from "@/store/authStore";

type DashboardViewProps = {
  user: AuthUser;
  onLogout: () => void;
};
```

`@/` は `src/` の alias です（`tsconfig.json` で設定済み）。

</details>

---

### タスク 5: ダッシュボードページを作る

**ファイル:** `src/app/dashboard/page.tsx`

以下の条件を満たすページを作ってください。

- `useAuthStore` からログイン状態とユーザーを取得する
- 未ログイン（`isLoggedIn === false`）のとき、`/` へリダイレクトする
- ログイン済みのとき、`DashboardView` を表示する
- ログアウト時は `logout()` を呼んでから `/` へ遷移する

```bash
pnpm dev
# → ログイン後 /dashboard が表示されることを確認
# → アドレスバーに直接 /dashboard を入力すると / に戻ることを確認
```

<details>
<summary>ヒント: useEffect でリダイレクトする</summary>

```tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const router = useRouter();
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

useEffect(() => {
  if (!isLoggedIn) {
    router.replace("/");  // ブラウザ履歴を残さずに遷移
  }
}, [isLoggedIn, router]);

// ログイン済みになるまで何も表示しない
if (!isLoggedIn) return null;
```

</details>

---

## 答え合わせ

実装が終わったら、見本コードと比べてみましょう。

```bash
# ストア
git show feat/21-initial-setup-top-page-dashboard:src/store/authStore.ts

# コンポーネント
git show feat/21-initial-setup-top-page-dashboard:src/components/dashboard/DashboardView.tsx

# ページ
git show feat/21-initial-setup-top-page-dashboard:src/app/dashboard/page.tsx
```

---

## 最終確認

```bash
pnpm test       # → 全テスト GREEN
pnpm typecheck  # → 型エラーなし
pnpm lint       # → ESLint エラーなし
```

---

## 理解チェック

- [ ] `useState` と Zustand の使い分けを説明できる
- [ ] `create()` と `set()` の役割を説明できる
- [ ] `useEffect()` が必要な場面を説明できる
- [ ] Props にダミーデータを渡してコンポーネント単体でテストするメリットを説明できる
- [ ] ダミーログインを Firebase に差し替えるイメージができる

---

## ダミーログインから Firebase に移行するには？

現在は Zustand にダミーデータをセットしているだけです。
Firebase を導入したら `src/app/page.tsx` の `handleLogin` を差し替えます。

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
    email: null,  // メールは保存しない（docs/data.md 参照）
  });
  router.push("/dashboard");
};
```
