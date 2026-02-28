# Data — Firestoreモデル / Seed / 画像管理

> TL;DR
> Firestoreは最小コレクション（users / dailyLogs / foods）でスタート。
> カロリーデータは `/data/seed/` に JSON で管理し、外部 API 依存なし。
> 料理画像は生成AIで用意し、`/public/images/foods/` に静的ホスティング。

---

## Decision

### Firestore データモデル（最小構成）

#### コレクション: `users`

```
users/{uid}
  - uid: string               # Firebase Auth の uid（= ドキュメントID）
  - displayName: string       # Google アカウントの表示名
  - goalCalories: number      # 目標カロリー（kcal/日）
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

> メールアドレスは**保存しない**（CLAUDE.md の Auth & Data Rules 参照）。
> **Open Question:** `photoURL`（Google のプロフィール画像URL）を保存するか？

---

#### コレクション: `users/{uid}/dailyLogs`

```
users/{uid}/dailyLogs/{date}    # date = "YYYY-MM-DD"（ドキュメントID）
  - date: string                # "YYYY-MM-DD"
  - totalCalories: number       # その日の合計カロリー（kcal）
  - entries: array              # 食事エントリの配列（サブコレクションにしない）
    - [
        {
          foodId: string,       # foods コレクションの ID
          foodName: string,     # 非正規化（検索コストを下げる）
          quantity: number,     # 量（g or 個）
          unit: string,         # "g" | "個" | "杯"
          calories: number,     # entries[i].quantity に基づく計算済みkcal
          recordedAt: Timestamp
        }
      ]
  - updatedAt: Timestamp
```

> **Open Question:** `entries` をサブコレクション `entries/{id}` にするか、配列で持つか？
> （配列の場合: 1日100件を超えない前提。超える場合はサブコレクションへ移行。）

---

#### コレクション: `foods`（読み取り専用 seed データ）

```
foods/{foodId}
  - foodId: string           # ドキュメントID（例："rice_bowl_200g"）
  - name: string             # 食品名（例："ご飯（茶碗1杯）"）
  - nameKana: string         # 検索用ふりがな（例："ごはん"）
  - caloriesPer100g: number  # 100gあたりのカロリー（kcal）
  - defaultUnit: string      # デフォルト単位（"g" | "個" | "杯"）
  - defaultQuantity: number  # デフォルト量（例：150）
  - imageFilename: string    # 画像ファイル名（例："rice_bowl.webp"）
  - category: string         # カテゴリ（例："主食", "主菜", "副菜", "飲み物"）
  - tags: string[]           # 検索タグ（例：["和食", "米"]）
  - createdAt: Timestamp
```

> Firestore Security Rules: `foods` は認証済みユーザーなら誰でも読み取り可能、書き込みは Admin SDK のみ。

---

### Firestore Security Rules（最小）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // foods: 認証済みなら読み取り可、書き込み不可
    match /foods/{foodId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // users: 自分のデータのみ読み書き可
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      match /dailyLogs/{date} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

---

## Seed データ

### 置き場所

```
/data/
  seed/
    foods.json          # 食品マスター（初期投入用）
    seed.ts             # Firestore へのインポートスクリプト（Admin SDK）
  schema/
    food.schema.ts      # Zod スキーマ（型の Single Source of Truth）
```

### `foods.json` スキーマ例

```json
[
  {
    "foodId": "rice_bowl_150g",
    "name": "ご飯（茶碗1杯）",
    "nameKana": "ごはん",
    "caloriesPer100g": 168,
    "defaultUnit": "g",
    "defaultQuantity": 150,
    "imageFilename": "rice_bowl.webp",
    "category": "主食",
    "tags": ["和食", "米", "炭水化物"]
  },
  {
    "foodId": "grilled_chicken_100g",
    "name": "焼き鶏（もも塩）",
    "nameKana": "やきとり",
    "caloriesPer100g": 177,
    "defaultUnit": "個",
    "defaultQuantity": 1,
    "imageFilename": "grilled_chicken.webp",
    "category": "主菜",
    "tags": ["和食", "鶏肉", "タンパク質"]
  }
]
```

> **Open Question:** 初期 seed の食品数は何品程度にするか？（最低 50〜100 品を推奨）
> **Open Question:** カテゴリの定義（主食/主菜/副菜/飲み物/デザート...）をいつ確定するか？

---

## 料理画像管理ルール

### 概要

料理画像は**生成AI（DALL·E 3 / Midjourney / Stable Diffusion 等）** で作成し、静的ファイルとして管理する。

### 保存場所

```
/public/
  images/
    foods/
      rice_bowl.webp
      grilled_chicken.webp
      ...
```

### 命名規則

- `{foodId}.webp`（`foods.json` の `imageFilename` と一致させる）
- 例：`rice_bowl.webp`、`grilled_chicken.webp`
- スペースなし、小文字、アンダースコア区切り

### サイズ・形式

| 項目 | 規定値 |
|---|---|
| フォーマット | WebP（圧縮率と品質のバランス） |
| サイズ | 400×400px（正方形） |
| ファイルサイズ | 最大 100KB（圧縮後） |
| 背景 | 白背景 or 透過（統一すること） |

### 生成・再生成手順

1. `data/seed/foods.json` の `foodId` と `name` をプロンプトに使用する
2. プロンプト例：`"A photo of [food name], Japanese food, on a white plate, top view, bright natural lighting, food photography style"`
3. 生成後、`/public/images/foods/{foodId}.webp` に配置する
4. `imageFilename` が `foods.json` と一致しているか確認する
5. 再生成が必要な場合は、元ファイルを上書きする（Git で差分管理）

> **Open Question:** 画像生成に使用するAIサービスを確定する（DALL·E 3 / Midjourney / その他）。
> **Open Question:** 画像を Vercel / Firebase Storage に移行するか、`/public/` のまま静的配信するか？

---

## Rationale

- `dailyLogs` を日付でドキュメント分割することで、1日分の取得が1クエリで済む
- `foodName` を非正規化して `entries` に含めることで、`foods` コレクションへの JOIN を不要にする
- seed JSON + Admin SDK スクリプトで再現性のあるデータ投入を実現する
- 生成AI画像 + WebP で著作権フリー & 高品質な画像を自前管理する

---

## Open Questions

| # | 質問 | 担当 | 期限 |
|---|---|---|---|
| 1 | `entries` は配列 vs サブコレクション、どちらにするか？ | - | - |
| 2 | 初期seed食品数の目標は？ | - | - |
| 3 | 画像生成AIサービスは何を使うか？ | - | - |
| 4 | カテゴリ分類の最終定義は？ | - | - |
| 5 | Firestore emulator をローカル開発で使うか？ | - | stack.md と連動 |

---

## Next Actions

- [ ] `data/schema/food.schema.ts` に Zod スキーマを定義する
- [ ] `data/seed/foods.json` に初期50品を投入する
- [ ] `data/seed/seed.ts` で Firestore インポートスクリプトを作成する
- [ ] Firestore Security Rules を Firebase Console に適用する
- [ ] 料理画像10〜20枚を生成し `/public/images/foods/` に配置する（MVP最小）
