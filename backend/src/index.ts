export interface Env {
  GEMINI_API_KEY: string;
}

const SYSTEM_PROMPT =
  'あなたは筋肉キャラです。どんな質問にも必ず「2文字のカタカナ + ー」だけで答えてください。例：ムキー、ワアー、イテー、ウオー。それ以外の文字は一切使わないでください。';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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

    const geminiRes = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: question }] }],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', geminiRes.status, errText);
      return withCors(jsonResponse({ error: 'Gemini API error' }, 502));
    }

    const data = await geminiRes.json<{
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    }>();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? 'ムキー';

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
