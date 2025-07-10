import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();
    const fileNames: Record<string, string> = {
      python: 'main.py',
      java: 'Main.java',
      cpp: 'main.cpp',
    };
    const pistonResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        version: '*',
        files: [{ name: fileNames[language] || 'main.txt', content: code }],
      }),
    });
    const result = await pistonResponse.json();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
