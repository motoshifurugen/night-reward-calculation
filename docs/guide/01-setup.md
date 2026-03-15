# 01 — 環境構築

> **ハンズオン形式です。**
> `practice/` ブランチでコードファイルがない状態から始めます。
> ファイルを1つずつ作りながら、各ツールの役割を理解しましょう。

---

## このチャプターで作るもの

Next.js 14 が動く開発環境を、設定ファイルを手で書きながら構築します。

```
完成後にできること:
  pnpm dev       → ブラウザで http://localhost:3000 が開く
  pnpm test      → テストが実行できる
  pnpm lint      → コードチェックができる
  pnpm typecheck → 型チェックができる
```

---

## 使用技術

| 技術 | 役割 |
|---|---|
| **Next.js 14** | React フレームワーク（App Router） |
| **TypeScript** | 型安全な JavaScript |
| **Tailwind CSS** | ユーティリティファーストの CSS |
| **Vitest** | 高速なテストランナー |
| **Zustand** | シンプルな状態管理ライブラリ |

---

## 前提条件

- Node.js 18 以上がインストールされていること
- Git がインストールされていること

確認コマンド:

```bash
node -v   # v18 以上であること
git -v
```

---

## 準備: 練習用ブランチを作る

```bash
git checkout main
git checkout -b practice/my-first-react-app
```

現時点でコードファイルは存在しません。`ls` で確認してみましょう。

```bash
ls
# → .claude/  .github/  .gitignore  CLAUDE.md  README.md  docs/
# src/ や package.json はまだない
```

---

## タスク 1: package.json を作る

`package.json` はプロジェクトの設定とパッケージ一覧を管理するファイルです。

**ファイル:** `package.json`（ルートに作成）

<details>
<summary>内容を見る</summary>

```json
{
  "name": "night-reward-calculation",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "next": "14.2.35",
    "react": "^18",
    "react-dom": "^18",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/coverage-v8": "^3.1.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.35",
    "jsdom": "^26.1.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5",
    "vitest": "^3.1.1"
  }
}
```

</details>

作成したらパッケージをインストールします。

```bash
# pnpm が未インストールの場合
npm install -g pnpm

pnpm install
# → node_modules/ が作成されれば OK
```

---

## タスク 2: TypeScript の設定ファイルを作る

TypeScript の動作を設定するファイルです。`strict: true` で厳格な型チェックを有効にします。

**ファイル:** `tsconfig.json`

<details>
<summary>内容を見る</summary>

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "types": ["vitest/globals"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

</details>

**ポイント:**
- `"strict": true` — 型チェックを厳格にする（バグを早期発見できる）
- `"paths": { "@/*": ["./src/*"] }` — `@/components/...` のような短い import が使えるようになる

---

## タスク 3: Next.js の設定ファイルを作る

**ファイル:** `next.config.mjs`

<details>
<summary>内容を見る</summary>

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

</details>

---

## タスク 4: Tailwind CSS の設定ファイルを作る

Tailwind に使用するファイルのパスと、プロジェクト独自のカラーを設定します。

**ファイル:** `tailwind.config.ts`

<details>
<summary>内容を見る</summary>

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // docs/ux.md のカラーパレット
        primary:   "#FFC300",  // サンフラワーイエロー: プライマリ CTA
        highlight: "#EFF669",  // ライムイエロー: バッジ・達成表示
        health:    "#9BCB3C",  // リーフグリーン: 健康スコア
        warning:   "#FF8C00",  // オレンジ: 警告
        danger:    "#CF3333",  // アラートレッド: エラー
        accent:    "#F39F9F",  // ピンク: サブ強調
      },
    },
  },
  plugins: [],
};

export default config;
```

</details>

**ポイント:**
- `content` — Tailwind がクラス名をスキャンするファイルの場所を指定する
- `theme.extend.colors` — 独自のカラー名を追加する（`bg-primary` などが使えるようになる）

---

## タスク 5: PostCSS と ESLint の設定ファイルを作る

Tailwind CSS の動作に必要な PostCSS と、コードチェック用の ESLint を設定します。

**ファイル:** `postcss.config.js`

<details>
<summary>内容を見る</summary>

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

</details>

**ファイル:** `.eslintrc.json`

<details>
<summary>内容を見る</summary>

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

</details>

---

## タスク 6: Vitest の設定ファイルを作る

テストの実行環境を設定します。

**ファイル:** `vitest.config.ts`

<details>
<summary>内容を見る</summary>

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",   // ブラウザ環境をシミュレートする
    globals: true,          // describe, it, expect などをimportなしで使えるようにする
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      exclude: ["node_modules/**", "src/test/**", "**/*.config.*", "src/app/layout.tsx"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

</details>

**ポイント:**
- `environment: "jsdom"` — Node.js 上でブラウザの DOM を再現する（React コンポーネントのテストに必要）
- `globals: true` — `describe()`, `it()`, `expect()` を毎回 import しなくて済む

---

## タスク 7: アプリの初期ファイルを作る

### テストのセットアップファイル

**ファイル:** `src/test/setup.ts`

<details>
<summary>内容を見る</summary>

```ts
import "@testing-library/jest-dom";
```

</details>

### グローバル CSS

**ファイル:** `src/app/globals.css`

<details>
<summary>内容を見る</summary>

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

</details>

### レイアウトファイル

全ページ共通のHTML構造を定義します。

**ファイル:** `src/app/layout.tsx`

<details>
<summary>内容を見る</summary>

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NightReward",
  description: "カロリー・食事管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-white text-[#1A1A1A]">{children}</body>
    </html>
  );
}
```

</details>

---

## タスク 8: 環境変数ファイルを作る

`.env.example` をコピーして `.env.local` を作成します。
（ダミーログインのため Firebase の値は今は不要です）

```bash
cp .env.example .env.local
```

---

## 動作確認

全ファイルを作成したら動作確認をします。

```bash
# 開発サーバーを起動
pnpm dev
```

この時点ではトップページのファイル（`src/app/page.tsx`）がないので、
Next.js のデフォルト画面または 404 が表示されます。問題ありません。

```bash
# テストが実行できることを確認（テストファイルがないので 0 件でOK）
pnpm test

# 型チェックが通ることを確認
pnpm typecheck

# Lint が通ることを確認
pnpm lint
```

---

## 完成後のファイル構成

```
/（リポジトリルート）
├── .env.local             ← 作成した
├── .eslintrc.json         ← 作成した
├── next.config.mjs        ← 作成した
├── package.json           ← 作成した
├── postcss.config.js      ← 作成した
├── tailwind.config.ts     ← 作成した
├── tsconfig.json          ← 作成した
├── vitest.config.ts       ← 作成した
└── src/
    ├── app/
    │   ├── globals.css    ← 作成した
    │   └── layout.tsx     ← 作成した
    └── test/
        └── setup.ts       ← 作成した
```

---

## 次のステップ

[02-top-page.md](./02-top-page.md) — トップページを TDD で実装する
