---
description: 単語を渡すと isValidAnswer() のテストケースを自動追加し npm test で検証する
argument-hint: <カタカナ単語>
allowed-tools: [Read, Edit, Bash]
---

単語 `$ARGUMENTS` を `isValidAnswer()` のテストケースとして `src/utils/validateAnswer.test.ts` に追加する。

## 手順

1. `$ARGUMENTS` が正規表現 `/^[ァ-ヶ]{2}ー$/` にマッチするか判定する
   - マッチする → **valid**
   - マッチしない → **invalid**

2. `src/utils/validateAnswer.test.ts` を Read する

3. 判定結果に応じてファイルを編集する:
   - **valid** の場合: `有効なケース` の `it.each` 配列の末尾に `'$ARGUMENTS',` を追加する
   - **invalid** の場合: `無効なケース` の `it.each` 配列の末尾に `['$ARGUMENTS', '<理由>'],` を追加する
     - `<理由>` は文字種・長さなど実態に即した簡潔な日本語（例: "カタカナ4文字 + ー", "ひらがな混じり"）

4. `npm test` を実行して全テストがパスすることを確認する

5. 結果を1行で報告する（例: `'ネコー' を有効なケースに追加 → 22件パス`）
