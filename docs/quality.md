# Quality — TDD / テスト戦略 / PR DoD / CI フロー

> TL;DR
> TDD（Red→Green→Refactor）を全ての機能開発に適用する。
> Vitest（Web）/ Jest（将来モバイル）でユニット・インテグレーションテストを自動化する。
> CIが全ゲートをパスしないとマージ不可。

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
- ツール：Vitest + Firebase Emulator（推奨）or msw（モックサーバー）
- 対象フロー：食品記録の保存・取得、ユーザー設定の保存

> **Open Question:** Firebase Emulator を使うか、msw でモックするか？

### E2E Tests（クリティカルフローのみ）

- 対象：ログインフロー、食品記録フロー（最低2フロー）
- ツール：Playwright
- タイミング：MVP 完成後、または CI 安定化後に追加
- 実行環境：CI の prod ブランチのみ（PR ごとには不要）

> **Open Question:** E2E は MVP に含めるか、Week 4 以降に後回しにするか？

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

> **Open Question:** GitHub Actions のワークフローファイルを `.github/workflows/ci.yml` として今すぐ作成するか？

---

## Rationale

- Vitest は Next.js / Vite 環境と親和性が高く、設定コストが低い
- カバレッジ目標 80% は、品質とスピードのバランスを取った現実的な数値
- CI でカバレッジを測定・ゲートにすることで、テスト追加の忘れを防ぐ
- E2E を後回しにする判断は、MVP スピードを優先するため（ただし将来必須）

---

## Open Questions

| # | 質問 | 担当 | 期限 |
|---|---|---|---|
| 1 | Firebase Emulator vs msw、どちらでモックするか？ | - | - |
| 2 | E2E（Playwright）を MVP に含めるか？ | - | stack.md と連動 |
| 3 | CI ワークフローを今すぐ実装するか？ | - | - |
| 4 | カバレッジ目標 80% は適切か？ | - | - |

---

## Next Actions

- [ ] `.github/workflows/ci.yml` を作成する（lint → typecheck → test → build）
- [ ] `vitest.config.ts` を設定する（カバレッジ含む）
- [ ] `eslint.config.js` を Next.js 推奨ルールで設定する
- [ ] `tsconfig.json` に `"strict": true` が設定されていることを確認する
