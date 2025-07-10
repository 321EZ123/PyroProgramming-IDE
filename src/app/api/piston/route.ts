export async function POST(request: Request) {
  try {
    const { language, code } = await request.json();
    const langMap: Record<string, { pistonLang: string; version: string }> = {
      python: { pistonLang: 'python3', version: '3.8' },
      java: { pistonLang: 'java', version: '11' },
      cpp: { pistonLang: 'cpp17', version: '17' },
    };
    
    const langInfo = langMap[language];
    if (!langInfo) {
      return new Response(JSON.stringify({ error: 'Unsupported language' }), { status: 400 });
    }
    
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        language: langInfo.pistonLang, 
        version: langInfo.version,
        files: [{
          name: 'main.' + (language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'), 
          content: code 
        }]
      }),
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
