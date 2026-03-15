# 01 — 環境構築ガイド

> このガイドは React / Next.js 初心者向けです。
> ゼロからプロジェクトを立ち上げるまでの手順を解説します。

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

---

## セットアップ手順

### 1. リポジトリをクローンする

```bash
git clone <リポジトリのURL>
cd night-reward-calculation
```

### 2. 依存パッケージをインストールする

このプロジェクトは `pnpm` を使います。

```bash
# pnpm が未インストールの場合
npm install -g pnpm

# パッケージをインストール
pnpm install
```

### 3. 環境変数を設定する

`.env.example` をコピーして `.env.local` を作成します。
（現時点ではダミーログインのため Firebase の設定は不要です）

```bash
cp .env.example .env.local
```

### 4. 開発サーバーを起動する

```bash
pnpm dev
```

ブラウザで http://localhost:3000 を開くとトップページが表示されます。

---

## コマンド一覧

| コマンド | 内容 |
|---|---|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | 本番ビルド |
| `pnpm lint` | コードチェック（ESLint） |
| `pnpm typecheck` | 型チェック（TypeScript） |
| `pnpm test` | テスト実行（Vitest） |
| `pnpm test:coverage` | カバレッジ付きテスト |

---

## プロジェクト構成

```
src/
├── app/                   # Next.js App Router のページ
│   ├── layout.tsx         # 全ページ共通のレイアウト
│   ├── page.tsx           # トップページ（/）
│   └── dashboard/
│       └── page.tsx       # ダッシュボード（/dashboard）
├── components/            # 再利用可能な UI コンポーネント
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   └── HeroSection.test.tsx
│   └── dashboard/
│       ├── DashboardView.tsx
│       └── DashboardView.test.tsx
├── store/                 # Zustand 状態管理
│   ├── authStore.ts
│   └── authStore.test.ts
└── test/
    └── setup.ts           # テストのセットアップ
```

---

## Tailwind CSS のカラーパレット

`tailwind.config.ts` に以下のカスタムカラーが設定されています。

| クラス名 | カラーコード | 用途 |
|---|---|---|
| `bg-primary` | `#FFC300` | メインボタン |
| `bg-highlight` | `#EFF669` | バッジ・達成表示 |
| `bg-health` | `#9BCB3C` | 健康スコア |
| `bg-warning` | `#FF8C00` | 警告 |
| `bg-danger` | `#CF3333` | エラー |
| `bg-accent` | `#F39F9F` | サブ強調 |

---

## 次のステップ

- [02-top-page.md](./02-top-page.md) — トップページの実装解説
- [03-dashboard.md](./03-dashboard.md) — ダッシュボードと状態管理の解説
