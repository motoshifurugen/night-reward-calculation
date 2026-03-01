# Quality — TDD / テスト戦略 / ブランチ戦略 / PR DoD / CI フロー

> TL;DR
> TDD（Red→Green→Refactor）を全ての機能開発に適用する。
> Vitest（Web）/ Jest（将来モバイル）でユニット・インテグレーションテストを自動化する。
> **main は保護され、PR のみマージ。全ブランチは Issue と対応し、PR は小さく（目安 400 LOC 未満）。**
> CIが全ゲートをパスしないとマージ不可。main は常にデプロイ可能であること。

---

## Decision

### TDD 方針

```
RED   → 失敗するテストを先に書く
GREEN → テストをパスする最小の実装を書く
REFACTOR → 構造を整理し、テストが引き続きパスすることを確認する
```

TDD が必須な場面：
- 新機能の実装
- バグ修正（再現テストを先に書く）
- ビジネスロジック（カロリー計算、バリデーションなど）

TDD が任意な場面：
- 純粋なリファクタリング（振る舞いを変えない）
- 設定ファイル / ドキュメントの変更
- 型定義のみの変更

---

## テストピラミッド

```
         [E2E]              ← 少数・高コスト・クリティカルフローのみ
       [Integration]        ← API Routes / Firestore / Service 層
     [Unit Tests]           ← 関数・フック・コンポーネント・バリデーション
```

### Unit Tests（最優先）

- 対象：純粋関数、カスタムフック、Zod スキーマ、ユーティリティ
- ツール：Vitest + Testing Library / React
- カバレッジ目標：**80%以上**（ドメインロジックは 100%目標）
- 実行速度：全テストが30秒以内に完了すること

### Integration Tests（必要に応じて）

- 対象：Next.js API Routes、Firestore との連携、認証フロー
- ツール：Vitest + **Firebase Emulator**（Integration Tests では Emulator を利用する）
- 対象フロー：食品記録の保存・取得、ユーザー設定の保存

### E2E Tests（クリティカルフローのみ）

- 対象：ログインフロー、食品記録フロー（最低2フロー）
- ツール：Playwright
- タイミング：**MVP では実施しない**。MVP 完成後、または CI 安定化後に追加
- 実行環境：CI の prod ブランチのみ（PR ごとには不要）

---

## ツール一覧

| ツール | 用途 | 実行コマンド |
|---|---|---|
| ESLint | Linting | `pnpm lint` |
| TypeScript | 型チェック | `pnpm typecheck` |
| Vitest | Unit / Integration テスト | `pnpm test` |
| Vitest UI | テスト結果の可視化 | `pnpm test:ui` |
| Vitest Coverage | カバレッジレポート | `pnpm test:coverage` |
| Playwright | E2E テスト | `pnpm test:e2e` |
| Next.js Build | ビルド確認 | `pnpm build` |

### モバイル版（将来）

| ツール | 用途 |
|---|---|
| Jest | Unit / Integration テスト |
| Testing Library / React Native | コンポーネントテスト |
| Maestro or Detox | E2E テスト |

---

## PR Definition of Done（DoD）

PR をマージするには、以下を**全て**満たす必要がある：

### 必須（CIで自動チェック）

- [ ] `pnpm lint` が **0エラー**で通過する
- [ ] `pnpm typecheck` が **0エラー**で通過する
- [ ] `pnpm test` が **全パス**する
- [ ] カバレッジが **80%以上**を維持している（回帰しない）
- [ ] `pnpm build` が **成功**する
- [ ] `console.log` / `debugger` が**残っていない**（Stop フックで自動検出）

### 手動チェック（レビュアーが確認）

- [ ] 新しいドメインロジックにはユニットテストがある
- [ ] API ルートには入力バリデーション（Zod）がある
- [ ] 環境変数を追加した場合、`.env.example` も更新されている
- [ ] 挙動・API・データ構造が変わった場合、`docs/` が更新されている
- [ ] セキュリティチェックリスト（security.md）を確認した

### マージ禁止条件

- Lint / typecheck / unit テスト が1件でも落ちている
- `console.log` が残っている
- テストのない新しいビジネスロジック
- ハードコードされたシークレット

---

## Branch Rules（ブランチ戦略）

**参照:** CLAUDE.md の Workflow セクションと整合させる。AI / 開発者ともこのルールに従う。

### 基本ルール

| ルール | 内容 |
|--------|------|
| **main は保護** | 直接 push 禁止。**PR 経由のみ**マージする。 |
| **Issue 必須** | すべてのブランチは **1 本の Issue に対応**する。Issue がない場合は先に Issue を作成する。 |
| **main は常にデプロイ可能** | main にマージされた時点で CI がグリーンであり、本番デプロイ可能な状態を保つ。 |

### ブランチ命名

- `feat/<issue>-<slug>` — 新機能（例: `feat/12-add-calorie-summary`）
- `fix/<issue>-<slug>` — バグ修正（例: `fix/15-login-redirect`）
- `chore/<issue>-<slug>` — 雑務・設定・ドキュメント（例: `chore/18-update-deps`）

`<issue>` は Issue 番号（数字）、`<slug>` は短い英数字ハイフン区切り。

### PR のルール

- **PR 説明に必須:** `Closes #<issue>` を記載する（GitHub で Issue 自動クローズ）。
- **PR は小さく保つ:** 目安 **400 LOC 未満**。責務ごとに分割し、1 PR で 1 つの関心に集中する。

---

## CI フロー（GitHub Actions）

```
[PR 作成 / push]
       │
       ▼
┌─────────────────────────────────────────┐
│  1. lint          pnpm lint             │ ← 失敗でブロック
│  2. typecheck     pnpm typecheck        │ ← 失敗でブロック
│  3. unit test     pnpm test             │ ← 失敗でブロック
│  4. coverage      pnpm test:coverage    │ ← 80%未満でブロック
│  5. build         pnpm build            │ ← 失敗でブロック
└─────────────────────────────────────────┘
       │ 全て ✅
       ▼
┌─────────────────────────────────────────┐
│  6. Vercel Preview デプロイ             │ ← PRごとに自動
└─────────────────────────────────────────┘
       │ main マージ時のみ
       ▼
┌─────────────────────────────────────────┐
│  7. e2e test      pnpm test:e2e        │ ← 将来追加
│  8. Vercel Production デプロイ          │ ← 自動
└─────────────────────────────────────────┘
```

**決定:** GitHub ワークフローファイル（`.github/workflows/ci.yml`）は**今は実装しない**。必要になった時点で追加する。

---

## Rationale

- Vitest は Next.js / Vite 環境と親和性が高く、設定コストが低い
- カバレッジ目標 **80%** で確定（品質とスピードのバランスを取った現実的な数値）
- CI でカバレッジを測定・ゲートにすることで、テスト追加の忘れを防ぐ
- E2E を後回しにする判断は、MVP スピードを優先するため（ただし将来必須）

---

## Open Questions（解決済み分の決定）

| # | 質問 | 回答・決定 |
|---|---|---|
| 1 | Firebase Emulator vs msw、どちらでモックするか？ | **Integration Tests には Firebase Emulator を利用する** |
| 2 | E2E（Playwright）を MVP に含めるか？ | **E2E Tests は MVP では実施しない** |
| 3 | CI ワークフローを今すぐ実装するか？ | **GitHub ワークフローファイルは今は実装しない** |
| 4 | カバレッジ目標 80% は適切か？ | **80% で OK（適切とする）** |

---

## Next Actions

- [ ] ~~`.github/workflows/ci.yml` を作成する~~ → **今は実装しない**（必要時に対応）
- [ ] `vitest.config.ts` を設定する（カバレッジ含む）
- [ ] `eslint.config.js` を Next.js 推奨ルールで設定する
- [ ] `tsconfig.json` に `"strict": true` が設定されていることを確認する
