# GitHub Issues 運用ガイド

## テンプレート一覧

| # | ファイル | 用途 | Label | 誰が作るか |
|---|---|---|---|---|
| 00 | `00-product-os.yml` | 運用ルール固定 | `foundation` | 2人で一緒に |
| 01 | `01-idea-card.yml` | アイディア記述 | `planning` | どちらでも |
| 02 | `02-idea-selection.yml` | スコアリングで2案に絞る | `decision` | DRI主導 |
| 03 | `03-interview-session.yml` | インタビュー1件記録 | `research` | 実施者 |
| 04 | `04-competitive-map.yml` | 競合・代替整理 | `research`, `decision` | 担当者 |
| 05 | `05-prototype-test.yml` | Figmaテスト記録 | `research` | 実施者 |
| 06 | `06-prd-lite.yml` | MVP確定（北極星） | `decision`, `foundation` | DRI主導 |
| 07 | `07-mvp-build-plan.yml` | 実装計画4週間 | `build`, `foundation` | 2人で一緒に |

---

## 推奨ラベル一覧

```
gh label create "foundation"  --color "#0052CC" --description "チームの土台となる意思決定"
gh label create "planning"    --color "#5319E7" --description "企画・アイディア段階"
gh label create "research"    --color "#0075CA" --description "インタビュー・競合調査"
gh label create "decision"    --color "#E4E669" --description "意思決定が必要なIssue"
gh label create "build"       --color "#D93F0B" --description "実装フェーズ"
gh label create "blocked"     --color "#B60205" --description "ブロッカーあり"
gh label create "needs-input" --color "#FEF2C0" --description "相手の意見が必要"
```

---

## 推奨マイルストーン

```
gh api repos/:owner/:repo/milestones --method POST -f title="Phase 0: OS & Ideas"     -f due_on="2024-02-11T23:59:59Z" -f description="Product OS確定・Idea Card出し切り"
gh api repos/:owner/:repo/milestones --method POST -f title="Phase 1: Validation"     -f due_on="2024-02-25T23:59:59Z" -f description="インタビュー・競合整理・プロトタイプテスト"
gh api repos/:owner/:repo/milestones --method POST -f title="Phase 2: PRD Lock"       -f due_on="2024-03-03T23:59:59Z" -f description="PRD-lite確定・Build Plan起票"
gh api repos/:owner/:repo/milestones --method POST -f title="W1: Foundation"          -f due_on="2024-03-10T23:59:59Z" -f description="環境・認証・Onboarding"
gh api repos/:owner/:repo/milestones --method POST -f title="W2: Core Value"          -f due_on="2024-03-17T23:59:59Z" -f description="チェックリスト・中心機能"
gh api repos/:owner/:repo/milestones --method POST -f title="W3: Polish"              -f due_on="2024-03-24T23:59:59Z" -f description="完了フロー・通知・モバイル"
gh api repos/:owner/:repo/milestones --method POST -f title="W4: Ship"                -f due_on="2024-03-31T23:59:59Z" -f description="本番公開・計測開始"
```

---

## Issue の進め方（フロー図）

```
00: Product OS
     │
     ▼
01: Idea Card × N件
     │
     ▼
02: Idea Selection（上位2案に絞る）
     │
     ├─ Winner A ──► 03: Interview × 3件
     │                    │
     └─ Winner B ──► 03: Interview × 3件
                          │
                    Strong? ──► 04: Competitive Map
                                     │
                                     ▼
                               05: Prototype Test
                                     │
                                Pass? ──► 06: PRD-lite
                                               │
                                               ▼
                                         07: MVP Build Plan
                                               │
                                          W1 → W2 → W3 → W4: Ship
```

---

## 意思決定ルール（Product OS補足）

- **通常の合意**: Issueコメントに 👍 = 同意
- **異議あり**: Issueにコメントして48時間待つ → 解決しなければDRIが決定
- **緊急**: DRIが即決 → Issue更新 → 事後報告
- **スコープ追加要求**: PRD-liteのNon-goalを確認 → 追加したければ新しいIssueで議論
