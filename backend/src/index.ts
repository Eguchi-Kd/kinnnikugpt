export interface Env {
  GEMINI_API_KEY: string;
}

const SYSTEM_PROMPT = `あなたは筋肉キャラです。
どんな質問にも、必ず「カタカナ2文字 + 長音符ー」の3文字だけで答えてください。

【ルール】
- 返答は必ずカタカナ2文字 + ー の合計3文字のみ
- 句読点・スペース・改行・説明文は一切禁止
- ー（長音符）は必ず末尾に1つだけ

【良い例】ムキー / ワアー / イテー / ウオー / ヌアー / キエー
【悪い例】ムキー！（記号NG）/ そうですね、ムキー（説明NG）/ ムキキー（4文字NG）

質問の内容に関わらず、3文字で返せ。`;

const RETRY_PROMPT = `前の返答はフォーマットが間違っています。
必ず「カタカナ2文字 + ー」の3文字だけで答えてください。例：ムキー`;

const VALID_RE = /^[ァ-ヶ]{2}ー$/;
const FALLBACK = 'ムキー';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

async function callGemini(
  apiKey: string,
  contents: { role?: string; parts: { text: string }[] }[],
): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Gemini error:', res.status, errText);
    return '';
  }

  const data = await res.json<GeminiResponse>();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }));
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/ask') {
      return withCors(new Response('Not Found', { status: 404 }));
    }

    let question: string;
    try {
      const body = await request.json<{ question?: string }>();
      question = body.question?.trim() ?? '';
    } catch {
      return withCors(jsonResponse({ error: 'Invalid JSON' }, 400));
    }

    if (!question) {
      return withCors(jsonResponse({ error: 'question is required' }, 400));
    }

    const userMessage = `${question}\n（返答は「カタカナ2文字+ー」の3文字のみ）`;
    const contents: { role?: string; parts: { text: string }[] }[] = [
      { parts: [{ text: userMessage }] },
    ];

    let answer = await callGemini(env.GEMINI_API_KEY, contents);

    if (!VALID_RE.test(answer)) {
      console.warn('Invalid format on first attempt:', JSON.stringify(answer));
      const retryContents = [
        ...contents,
        { role: 'model', parts: [{ text: answer }] },
        { parts: [{ text: RETRY_PROMPT }] },
      ];
      answer = await callGemini(env.GEMINI_API_KEY, retryContents);
    }

    if (!VALID_RE.test(answer)) {
      console.warn('Invalid format after retry, using fallback:', JSON.stringify(answer));
      answer = FALLBACK;
    }

    return withCors(jsonResponse({ answer }));
  },
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new Response(response.body, { status: response.status, headers });
}
