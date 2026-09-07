# Lunefee — ブランドサイト

「月の妖精」を意味するモノトーンの日用品ブランド Lunefee の世界観サイト。
実売は外部ECの [lunefee.base.shop](https://lunefee.base.shop/)、更新は
[Instagram](https://www.instagram.com/lunefee_official/) に集約し、このサイトは
そこへの入口（1ページ）として機能します。

**表示は英語が基準**。ナビ・見出し・ボタン・フッターなどはすべて英語固定で、
右上の `EN / JA / KO` トグルは「説明文（数文だけ）」の言語だけを切り替えます。
初回訪問は必ず英語表示、選んだ言語はブラウザに記憶されます。

---

## ファイル構成

```
lunefee-site/
├── index.html            本体（1ページ）
├── favicon.svg           月＋星のファビコン
├── assets/
│   ├── css/style.css     デザイン一式（:root 変数で色・余白・モーションを管理）
│   ├── js/main.js        言語切替 / スムーススクロール / 演出 / 星屑アニメ
│   ├── img/logo.jpg      元ロゴ（OGP用・白背景のまま）
│   └── img/logo.png      背景を透過に加工したロゴ（サイト表示用）
└── README.md
```

外部依存はフォント（Google Fonts: Jost / Inter / Noto Sans KR / Zen Kaku Gothic New）と
スムーススクロール用の Lenis（jsDelivr CDN）のみ。どちらも読めなくても表示は崩れません。

## ローカルで確認する

```bash
cd ~/lunefee-site
python3 -m http.server 8000
# → http://localhost:8000
```

## 無料で公開する（おすすめ順）

### 1. Netlify Drop（最速）
1. <https://app.netlify.com/drop> を開く
2. `lunefee-site` フォルダごとブラウザにドラッグ＆ドロップ
3. 発行された URL で即公開。独自ドメインは後から設定可能

### 2. Cloudflare Pages / Vercel
- GitHub にこのフォルダを push → 対象リポジトリを連携
- ビルド設定は不要（Framework preset: なし / 出力ディレクトリ: ルート）

### 3. GitHub Pages
- リポジトリ Settings → Pages → Branch: `main` / `/ (root)`

## 独自ドメイン

取得済みドメインを上記ホスティングの「Custom domain」に追加し、表示された
DNS レコードをドメイン側に設定。HTTPS は各サービスが自動発行します。

---

## 中身を編集する

> **重要**: CSS / JS を編集したら `index.html` 末尾と `<head>` の
> `style.css?v=2` / `main.js?v=2` の数字を 1 つ上げてください。
> ブラウザやCDNの古いキャッシュを確実に更新させるためのものです。

### 説明文（3言語）
`assets/js/main.js` 冒頭の `I18N` オブジェクトに、切り替え対象の数文だけが
`en` / `ja` / `ko` で入っています。同じキーを揃えて書き換えます。
英語（既定）を変えたら `index.html` 内の同じ文（`data-i18n` が付いた要素）も
合わせてください。

### 見出し・ボタンなどの英語コピー
`index.html` に直接書かれています（`Wear who you are.` /
`Lunefee means "moon fairy."` / `The world, in frames.` /
`Every piece, in one place.` など）。差し替えは HTML を直接編集。

### リンク先
EC・Instagram の URL は `index.html` 内に直書き（複数箇所）。変更時は一括置換。
「Contact」は現在 Instagram に集約。メールにする場合はフッターの該当 `<a>` を
`mailto:` に変更。

### 画像を差し込む
今はプレースホルダー（グレー枠＋「Coming soon」）です。

- **ロゴ差し替え**: 白背景の元画像を `assets/img/logo.jpg`、背景透過版を
  `assets/img/logo.png` として同名で上書き（表示に使うのは `logo.png`）。
- **Lookbook**: `index.html` の `.grid__item` 内の `<span class="grid__ph">…</span>` を
  `<img src="assets/img/look-01.jpg" alt="">` に置き換え（`object-fit` で自動トリミング、
  ホバーで軽くズーム＋水色のかかり）。
- **Collection カード**: `.card` の中身を実商品の画像・名称・価格に。
  各リンク先を BASE の該当商品ページ URL へ。

### 色・フォント・モーション
`assets/css/style.css` 冒頭の `:root`。
- 色: `--ink` `--paper` `--gray*` `--hairline`（白黒グレー）＋ `--accent*`（差し色の水色）
- 余白: `--section-y` ほか
- 動き: `--ease`、モーション量は `main.js` の各所（`lerp` = スクロールの粘り、
  `marquee` の秒数、reveal のディレイ `i * 70`）

`prefers-reduced-motion` が有効な環境では、イントロ・マーキー・視差・
リビールはすべて自動で無効化されます。

### OGP / SNS シェア画像
`<meta property="og:image">` は暫定でロゴ。専用画像（1200×630 推奨）を
作ったら差し替えてください。
