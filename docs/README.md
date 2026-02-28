# docs/ — ドキュメント索引

> TL;DR
> このディレクトリがプロジェクトの唯一の真実の源（Single Source of Truth）です。
> 行動・実装を変えたらここも更新してください。
> 読む順番：product → ux → stack → data → quality。

---

## ファイル一覧

| ファイル | 内容 | 主な読者 |
|---|---|---|
| [product.md](./product.md) | ビジョン / MVP / ロールアウト計画 | 全員 |
| [ux.md](./ux.md) | 画面一覧 / フロー / UX原則 / カラーパレット | デザイン・フロント |
| [stack.md](./stack.md) | 技術スタック / デプロイ / 環境方針 | エンジニア全員 |
| [data.md](./data.md) | Firestoreモデル / seedデータ / 画像管理 | バックエンド・フロント |
| [quality.md](./quality.md) | TDD / テスト戦略 / PR DoD / CI フロー | エンジニア全員 |

---

## 更新ルール

- 機能や挙動を変えたら、**同じPRでdocsも更新**する（コードだけのPRは原則 NG）
- 未確定事項は `<!-- TODO: ... -->` ではなく `> **Open Question:** ...` で明記する
- 古くなったセクションは削除し、理由を 1 行コメントで残す

---

## Open Questions

> **Open Question:** アーキテクチャ ADR（Architecture Decision Records）を別ディレクトリ `docs/adr/` で管理するか？

---

## Next Actions

- [ ] product.md の Open Questions をチームで回答する
- [ ] ux.md の画面一覧を Figma と照合する（Figmaがあれば）
- [ ] quality.md の CI ワークフローを `.github/workflows/` に実装する
