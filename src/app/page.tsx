"use client";
import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

export default function Home() {
  const [tab, setTab] = useState<'languages' | 'web'>('languages');
  const langs = ['python', 'java', 'cpp'] as const;
  const [language, setLanguage] = useState<typeof langs[number]>('python');
  
  const defaultCode: Record<typeof langs[number], string> = {
    python: 'print("Hello, World!")',
    java: 'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }',
    cpp: '#include <iostream>\nint main() { std::cout << "Hello, World!"; return 0; }',
  };
  
  const [code, setCode] = useState(defaultCode[language]);
  const [output, setOutput] = useState('');
  
  const subTabs = ['html', 'css', 'js'] as const;
  const [subTab, setSubTab] = useState<typeof subTabs[number]>('html');
  const [htmlCode, setHtmlCode] = useState('<h1>Hello, Web IDE!</h1>');
  const [cssCode, setCssCode] = useState('body { font-family: sans-serif; }');
  const [jsCode, setJsCode] = useState('console.log("Hello, Web IDE!");');
  const [srcDoc, setSrcDoc] = useState('');

  const runCode = async () => {
    if (tab === 'languages') {
      const res = await fetch('/api/piston', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language, 
          code, 
          version: "3.8" // bye bye version error
        }),
      });
      const data = await res.json();
      setOutput(data.run?.stdout || data.run?.stderr || JSON.stringify(data, null, 2));
    } else {
      const doc = `<!DOCTYPE html><html><head><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}<\/script></body></html>`;
      setSrcDoc(doc);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <button 
          onClick={() => setTab('languages')} 
          className={`${tab === 'languages' ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white' : 'bg-gray-200'} px-4 py-2`}
        >
          Languages IDE
        </button>
        <button 
          onClick={() => setTab('web')} 
          className={`${tab === 'web' ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white' : 'bg-gray-200'} px-4 py-2`}
        >
          Web IDE
        </button>
      </div>
      <div className="flex flex-1">
        <div className="w-1/2 border-r border-black">
          {tab === 'languages' ? (
            <div className="p-2 flex flex-col h-full">
              <select 
                value={language} 
                onChange={e => { 
                  const newLang = e.target.value as typeof langs[number]; 
                  setLanguage(newLang); 
                  setCode(defaultCode[newLang]); 
                }} 
                className="mb-2 p-1 border"
              >
                {langs.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
              <div className="flex-1">
                <CodeMirror
                  value={code}
                  height="100%"
                  extensions={[language === 'python' ? python() : language === 'java' ? java() : cpp()]}
                  onChange={(value) => setCode(value)}
                />
              </div>
              <button onClick={runCode} className="mt-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white px-4 py-2 rounded">
                Run
              </button>
            </div>
          ) : (
            <div className="p-2 flex flex-col h-full">
              <div className="flex mb-2">
                {subTabs.map(st => (
                  <button 
                    key={st} 
                    onClick={() => setSubTab(st)} 
                    className={`${subTab === st ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white' : 'bg-gray-200'} px-3 py-1 mx-1`}
                  >
                    {st.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <CodeMirror
                  value={subTab === 'html' ? htmlCode : subTab === 'css' ? cssCode : jsCode}
                  height="100%"
                  extensions={[]}
                  onChange={value => 
                    subTab === 'html' ? setHtmlCode(value) : subTab === 'css' ? setCssCode(value) : setJsCode(value)
                  }
                />
              </div>
              <button onClick={runCode} className="mt-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white px-4 py-2 rounded">
                Run
              </button>
            </div>
          )}
        </div>
        <div className="w-1/2">
          {tab === 'languages' ? (
            <pre className="p-2 h-full overflow-auto bg-black text-white">{output}</pre>
          ) : (
            <iframe title="web-preview" srcDoc={srcDoc} sandbox="allow-scripts" className="w-full h-full" />
          )}
        </div>
      </div>
    </div>
  );
}
