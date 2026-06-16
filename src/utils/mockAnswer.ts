const RESPONSES = ['ムキー', 'ワアー', 'イテー', 'ウオー', 'ヌアー', 'キエー'];

export function getMockAnswer(_question: string): string {
  return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}
