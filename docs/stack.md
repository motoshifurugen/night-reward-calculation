# Stack — 技術スタック / デプロイ / 環境方針

> TL;DR
> Web版は Next.js + TypeScript + Tailwind + Zustand + Firebase で確定。
> デプロイは Vercel（dev / prod の2環境）。
> モバイル版（React Native + EAS）は将来フェーズで設計する。

---

## Decision

### Web 版スタック（確定）

| カテゴリ | 技術 | バージョン目安 | 備考 |
|---|---|---|---|
| 言語 | TypeScript | 5.x | strict mode ON |
| フレームワーク | Next.js | 14.x (App Router) | |
| UI | React | 18.x | Next.js に内包 |
| スタイリング | Tailwind CSS | 3.x | カスタムカラー設定必須 |
| フォーム | React Hook Form + Zod | 最新 | サーバー/クライアント両側でバリデーション |
| 状態管理 | Zustand | 最新 | グローバル状態のみ（サーバー状態は Firestore SDK） |
| DB | Cloud Firestore | Firebase v10+ | |
| 認証 | Firebase Authentication | Firebase v10+ | Google Sign-In のみ |
| テスト（Unit/Integration） | Vitest | 最新 | jsdom 環境 |
| テスト（コンポーネント） | Testing Library / React | 最新 | Vitest と組み合わせ |
| ビルドツール | Vite（Vitest用） / Next.js | - | Next.js 本体は Turbopack / webpack |
| デプロイ | Vercel | - | GitHub 連携で自動デプロイ |

> **Open Question:** E2E テストは MVP に含めるか？含める場合 Playwright を採用する（quality.md 参照）。
> **Open Question:** Firestore の `emulator` をローカル開発で使うか？

---

### モバイル版スタック（将来フェーズ・参考）

| カテゴリ | 技術 | 備考 |
|---|---|---|
| フレームワーク | React Native (Expo) | Web との React 知識を流用 |
| スタイリング | NativeWind | Tailwind CSS 互換クラス名 |
| テスト | Jest + Testing Library / RN | |
| ビルド / デプロイ | EAS (Expo Application Services) | iOS / Android 両対応 |
| 認証 | Firebase Authentication | Web 版と共通 |
| DB | Cloud Firestore | Web 版と共通 |

> モバイル版は「どのアプリよりも UX にこだわる」を開発原則とする。
> Web 版で確立したデザイントークン（色・フォント・余白）を NativeWind で再利用する。

---

## デプロイ環境方針

| 環境 | URL（例） | ブランチ | 用途 |
|---|---|---|---|
| dev（Preview） | `*.vercel.app` | `feat/*` / `fix/*` | PR ごとに自動生成されるプレビュー |
| prod | `your-domain.com` | `main` | 本番（Vercel 自動デプロイ） |

```
git push origin feat/xxx  →  Vercel Preview URL 自動発行
PR merge to main          →  Vercel Production 自動デプロイ
```

> **Open Question:** カスタムドメインは何を使うか？取得済みか？

---

## 環境変数

`.env.example` を必ずリポジトリに含める。実際の値は Vercel の Environment Variables に設定する。

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# App
NEXT_PUBLIC_APP_URL=
```

- `NEXT_PUBLIC_` prefix のものはクライアントに公開される（Firebase の公開設定は Firebase Console の Security Rules で制御）
- シークレット（サービスアカウントキーなど）は `NEXT_PUBLIC_` なし、サーバー専用にする

---

## Rationale

- Next.js App Router を採用することで、SSR / SSG / Server Components を段階的に活用できる
- Zustand は軽量でボイラープレートが少なく、2人開発に適している
- Firebase をフルマネージドで使うことで、インフラ管理コストをゼロにする
- Vercel + GitHub 連携でデプロイフローを自動化し、CI/CD の手動操作を排除する

---

## Open Questions

| # | 質問 | 担当 | 期限 |
|---|---|---|---|
| 1 | Firebase プロジェクトは作成済みか？ | - | - |
| 2 | Firestore の `emulator` をローカル開発に使うか？ | - | - |
| 3 | E2E（Playwright）を MVP に含めるか？ | - | - |
| 4 | カスタムドメインは何を使うか？ | - | - |
| 5 | Next.js の Turbopack を有効化するか（実験的）？ | - | - |

---

## Next Actions

- [ ] Firebase プロジェクトを作成し、環境変数を `.env.local` と Vercel に設定する
- [ ] `.env.example` をリポジトリ root に追加する
- [ ] `tailwind.config.ts` にカラーパレット（ux.md 参照）を設定する
- [ ] Vercel プロジェクトと GitHub リポジトリを連携する
