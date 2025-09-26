# 🎮 Breakout React

React + TypeScript + Canvas で作った **ブロック崩しゲーム** です。  
PC とスマホの両方でプレイできます。

![screenshot](./screenshot.png) <!-- 必要ならキャプチャをここに置く -->

---

## 🚀 Demo

👉 [GitHub Pages で遊ぶ](https://n-yata.github.io/breakout-react/)  
（※リポジトリ設定で GitHub Pages を有効にしてください）

---

## 🎮 操作方法

### 🖥️ PC
- **← / → キー** : パドルを左右に移動
- ブロックをすべて壊すと **YOU WIN!**
- ボールを落とすとライフが減り、0になると **GAME OVER**

### 📱 スマホ / タブレット
- **画面タップ** : 左半分で左移動、右半分で右移動
- **スワイプ操作** : パドルが指に追従します
- Restart ボタンもタッチで押せます

---

## ⚙️ 開発環境

- React 18
- TypeScript
- Vite
- Canvas API

---

## 🛠️ ローカルでの実行方法

```bash
# クローン
git clone https://github.com/n-yata/breakout-react.git
cd breakout-react

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
