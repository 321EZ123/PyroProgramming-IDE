export async function POST(request: Request) {
  try {
    const { language, code } = await request.json();
    const langMap: Record<string, string> = {
      python: 'python3',
      java: 'java',
      cpp: 'cpp17',
    };
    const pistonLang = langMap[language];
    if (!pistonLang) {
      return new Response(JSON.stringify({ error: 'Unsupported language' }), { status: 400 });
    }
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: pistonLang, source: code }),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), { status: 500 });
  }
}
