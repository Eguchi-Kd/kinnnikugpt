import { describe, it, expect } from 'vitest';
import { isValidAnswer } from './validateAnswer';

describe('isValidAnswer', () => {
  describe('有効なケース', () => {
    it.each([
      'ムキー',
      'ワアー',
      'イテー',
      'ウオー',
      'ヌアー',
      'キエー',
      'アアー', // 同じ文字が2つ
      'ヴァー', // 半濁点付き + 小文字
      'ァァー', // 小文字カタカナ2つ
      'ネコー',
      'ワホー',
    ])('"%s" は valid', (input) => {
      expect(isValidAnswer(input)).toBe(true);
    });
  });

  describe('無効なケース', () => {
    it.each([
      ['', '空文字'],
      ['ー', '長音符のみ'],
      ['アー', 'カタカナ1文字 + ー'],
      ['ムキ', 'ー なし'],
      ['ムキキー', 'カタカナ3文字 + ー'],
      ['ムキーア', 'ー の後に余分な文字'],
      ['むきー', 'ひらがな'],
      ['筋肉ー', '漢字 + ー'],
      ['AIー', 'ASCII + ー'],
      ['ームー', '先頭が長音符'],
      ['ムキー！', '末尾に記号'],
      [' ムキー', '先頭にスペース'],
      ['ワホ!!', '末尾が長音符でなく記号'],
    ])('"%s" は invalid (%s)', (input) => {
      expect(isValidAnswer(input)).toBe(false);
    });
  });
});
