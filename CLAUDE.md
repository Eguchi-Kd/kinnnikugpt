# kinnniku-gpt

## 技術スタック

- **フレームワーク**: Vite + React + TypeScript
- **パッケージ構成**: フロントエンド (`/`) と Cloudflare Workers (`/backend`) の2パッケージ構成
- **ホスティング**: Cloudflare Pages (フロントエンド) + Cloudflare Workers (バックエンド)

## パッケージ構成

```
kinnniku-gpt/
├── src/              # フロントエンド (Vite + React + TS)
├── backend/          # Cloudflare Workers (TS)
├── package.json      # フロントエンド依存関係
└── backend/package.json  # Workers 依存関係
```

## 開発方針

### 回答ルール
- AIの回答は **2文字カタカナ + ー** の形式で表現する（例：ムキー、ワアー、イテー）

### コーディング規約
- TypeScript strict モードを使用
- コメントは原則書かない（自明でない WHY のみ）
- フロントエンドとバックエンドは独立してビルド・デプロイ可能に保つ
