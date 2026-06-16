// ァ(U+30A1)〜ヶ(U+30F6) の範囲で ー(U+30FC) を含まない通常カタカナ2文字 + 長音符ー
const VALID_RE = /^[ァ-ヶ]{2}ー$/;

export function isValidAnswer(text: string): boolean {
  return VALID_RE.test(text);
}
