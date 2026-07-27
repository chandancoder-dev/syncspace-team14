import { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { FiChevronDown, FiCode } from 'react-icons/fi';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' },
  { id: 'cpp', label: 'C++' },
];

const DEFAULT_CODE = {
  javascript: `// Start coding in JavaScript\nfunction hello() {\n  console.log("Hello, SyncSpace!");\n}\n\nhello();\n`,
  python: `# Start coding in Python\ndef hello():\n    print("Hello, SyncSpace!")\n\nhello()\n`,
  java: `// Start coding in Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, SyncSpace!");\n    }\n}\n`,
  c: `// Start coding in C\n#include <stdio.h>\n\nint main() {\n    printf("Hello, SyncSpace!\\n");\n    return 0;\n}\n`,
  cpp: `// Start coding in C++\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, SyncSpace!" << endl;\n    return 0;\n}\n`,
};

const CodeEditor = ({ ydoc, me, users }) => {
  const [language, setLanguage] = useState('javascript');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const editorRef = useRef(null);
  const langMenuRef = useRef(null);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Define a custom light theme matching the palette
    monaco.editor.defineTheme('syncspace-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
        { token: 'keyword', foreground: '2563EB' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'D97706' },
        { token: 'type', foreground: '1E3A8A' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#1E293B',
        'editor.lineHighlightBackground': '#F8FAFC',
        'editor.selectionBackground': '#DBEAFE',
        'editor.inactiveSelectionBackground': '#EFF6FF',
        'editorLineNumber.foreground': '#94A3B8',
        'editorLineNumber.activeForeground': '#2563EB',
        'editorCursor.foreground': '#2563EB',
        'editorIndentGuide.background': '#E2E8F0',
        'editorIndentGuide.activeBackground': '#BFDBFE',
        'editor.selectionHighlightBackground': '#DBEAFE80',
        'editorBracketMatch.background': '#DBEAFE',
        'editorBracketMatch.border': '#2563EB',
      },
    });

    monaco.editor.setTheme('syncspace-light');

    // Focus the editor
    editor.focus();
  }, []);

  const handleLanguageChange = (langId) => {
    setLanguage(langId);
    setShowLangMenu(false);

    // If editor is empty or has default code, replace with new language default
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      const isDefaultCode = Object.values(DEFAULT_CODE).some(
        (code) => code.trim() === currentValue.trim()
      );
      if (!currentValue.trim() || isDefaultCode) {
        editorRef.current.setValue(DEFAULT_CODE[langId]);
      }
    }
  };

  const currentLang = LANGUAGES.find((l) => l.id === language);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        borderLeft: '1px solid #DBEAFE',
        fontFamily: '"Poppins", system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid #DBEAFE',
          background: '#FFFFFF',
          minHeight: 48,
          flexShrink: 0,
        }}
      >
        {/* Left — label + language selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#1E3A8A',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <FiCode size={16} />
            Code Editor
          </div>

          {/* Language selector */}
          <div ref={langMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu((v) => !v)}
              aria-label="Select language"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                background: '#EFF6FF',
                border: '1px solid #DBEAFE',
                borderRadius: 6,
                color: '#1E3A8A',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#DBEAFE')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#EFF6FF')}
            >
              {currentLang?.label || 'JavaScript'}
              <FiChevronDown size={14} />
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#FFFFFF',
                  border: '1px solid #DBEAFE',
                  borderRadius: 10,
                  boxShadow: '0 8px 20px rgba(30, 58, 138, 0.12)',
                  zIndex: 50,
                  minWidth: 160,
                  padding: 4,
                }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: language === lang.id ? '#EFF6FF' : 'transparent',
                      border: 'none',
                      borderRadius: 6,
                      color: language === lang.id ? '#2563EB' : '#1E293B',
                      fontWeight: language === lang.id ? 600 : 400,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lang.id) e.currentTarget.style.background = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang.id) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — file info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              color: '#64748B',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '3px 8px',
              borderRadius: 4,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            main.{language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : 'js'}
          </span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={language}
          defaultValue={DEFAULT_CODE[language]}
          onMount={handleEditorDidMount}
          loading={
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                fontSize: 14,
              }}
            >
              Loading editor...
            </div>
          }
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            wordWrap: 'on',
            suggest: {
              showMethods: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showKeywords: true,
              showSnippets: true,
            },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
