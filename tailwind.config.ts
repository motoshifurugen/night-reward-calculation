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
        primary: "#FFC300",    // サンフラワーイエロー: プライマリ CTA / 重要ボタン
        highlight: "#EFF669",  // ライムイエロー: ハイライト / バッジ / 達成表示
        health: "#9BCB3C",     // リーフグリーン: 健康スコア / 目標達成
        warning: "#FF8C00",    // オレンジ: 警告 / カロリー超過の手前
        danger: "#CF3333",     // アラートレッド: エラー / カロリー超過
        accent: "#F39F9F",     // ピンク: サブ強調 / タグ / 補助情報
      },
    },
  },
  plugins: [],
};

export default config;
