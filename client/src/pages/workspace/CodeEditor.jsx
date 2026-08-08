import { useState, useRef, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { FiChevronDown, FiCode, FiUsers, FiLoader, FiPlay } from 'react-icons/fi';
import { LANGUAGES, FILE_EXTENSIONS, DEFAULT_CODE } from '../../hooks/codeEditorConfig';
import useCodeExecution from '../../hooks/useCodeExecution';
import useWebContainer from '../../hooks/useWebContainer';
import FileExplorer from './FileExplorer';
import EditorTabs from './EditorTabs';
import Terminal from './Terminal';

const CodeEditor = ({ ydoc, awareness, me, users }) => {
  const [language, setLanguage] = useState("javascript");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [editorFailed, setEditorFailed] = useState(false);
  const [, setAwarenessTick] = useState(0);
  const { isRunning, output, runCode } = useCodeExecution();

  // WebContainer state (for multi-file mode)
  const wc = useWebContainer(language);
  const defaultFileName = language === 'java' ? 'Main.java' : `main.${FILE_EXTENSIONS[language] || 'js'}`;
  const [openFiles, setOpenFiles] = useState([defaultFileName]);
  const [activeFile, setActiveFile] = useState(defaultFileName);
  const [fileContent, setFileContent] = useState(DEFAULT_CODE.javascript);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);

  // Update file explorer when language changes
  useEffect(() => {
    const newFileName = language === 'java' ? 'Main.java' : `main.${FILE_EXTENSIONS[language] || 'js'}`;
    setOpenFiles([newFileName]);
    setActiveFile(newFileName);
    setFileContent(DEFAULT_CODE[language] || '');
    // Reset WebContainer files for the new language
    if (wc.booted) {
      wc.resetFiles(language);
    }
  }, [language]);

  // Monaco load timeout
  useEffect(() => {
    if (editorReady) return;
    const timer = setTimeout(() => {
      if (!editorReady) setEditorFailed(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, [editorReady]);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const bindingRef = useRef(null);
  const langMenuRef = useRef(null);

  // Get the shared Yjs text type for code
  const yText = ydoc.getText("code");
  const yMeta = ydoc.getMap("editor-meta");

  // Re-render when awareness changes so cursor styles update
  useEffect(() => {
    if (!awareness) return;
    const onUpdate = () => setAwarenessTick((n) => n + 1);
    awareness.on("change", onUpdate);
    return () => awareness.off("change", onUpdate);
  }, [awareness]);

  // Sync language from Yjs shared state
  useEffect(() => {
    const syncLang = () => {
      const sharedLang = yMeta.get("language");
      if (sharedLang && LANGUAGES.some((l) => l.id === sharedLang)) {
        setLanguage(sharedLang);
      }
    };
    syncLang();
    yMeta.observe(syncLang);
    return () => yMeta.unobserve(syncLang);
  }, [yMeta]);

  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Define custom theme
      monaco.editor.defineTheme("syncspace-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "64748B", fontStyle: "italic" },
          { token: "keyword", foreground: "2563EB" },
          { token: "string", foreground: "059669" },
          { token: "number", foreground: "D97706" },
          { token: "type", foreground: "1E3A8A" },
        ],
        colors: {
          "editor.background": "#FFFFFF",
          "editor.foreground": "#1E293B",
          "editor.lineHighlightBackground": "#F8FAFC",
          "editor.selectionBackground": "#DBEAFE",
          "editor.inactiveSelectionBackground": "#EFF6FF",
          "editorLineNumber.foreground": "#94A3B8",
          "editorLineNumber.activeForeground": "#2563EB",
          "editorCursor.foreground": "#2563EB",
          "editorIndentGuide.background": "#E2E8F0",
          "editorIndentGuide.activeBackground": "#BFDBFE",
          "editor.selectionHighlightBackground": "#DBEAFE80",
          "editorBracketMatch.background": "#DBEAFE",
          "editorBracketMatch.border": "#2563EB",
        },
      });

      monaco.editor.setTheme("syncspace-light");
      setTimeout(() => {
        if (yText.length === 0) {
          const currentLang = yMeta.get("language") || "javascript";
          yText.insert(0, DEFAULT_CODE[currentLang] || DEFAULT_CODE.javascript);
        }
      }, 500);

      // Create the Yjs <-> Monaco binding with awareness for remote cursors
      bindingRef.current = new MonacoBinding(
        yText,
        editor.getModel(),
        new Set([editor]),
        awareness,
      );

      setEditorReady(true);
      editor.focus();
    },
    [yText, yMeta, awareness],
  );

  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
    };
  }, []);

  const handleLanguageChange = (langId) => {
    setLanguage(langId);
    setShowLangMenu(false);
    yMeta.set("language", langId);

    // Update Monaco's language model
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, langId);
      }
    }

    // Check if current content is a default template (any language)
    const currentText = yText.toString();
    const normalize = (s) => s.replace(/\s+/g, "").toLowerCase();
    const currentNorm = normalize(currentText);
    const isDefaultCode =
      !currentText.trim() ||
      Object.values(DEFAULT_CODE).some(
        (code) => normalize(code) === currentNorm,
      );

    if (isDefaultCode) {
      const newCode = DEFAULT_CODE[langId];

      // Destroy binding first
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }

      // Update Yjs shared text
      ydoc.transact(() => {
        yText.delete(0, yText.length);
        yText.insert(0, newCode);
      });

      // Update Monaco editor directly
      if (editorRef.current) {
        editorRef.current.setValue(newCode);
      }

      // Recreate binding after a tick to ensure Monaco is settled
      setTimeout(() => {
        if (editorRef.current) {
          bindingRef.current = new MonacoBinding(
            yText,
            editorRef.current.getModel(),
            new Set([editorRef.current]),
            awareness || undefined,
          );
        }
      }, 50);
    }
  };

  // Update Monaco language model when language changes (from remote)
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  // Close language menu on outside click
  useEffect(() => {
    if (!showLangMenu) return;
    const onClick = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showLangMenu]);

  const currentLang = LANGUAGES.find((l) => l.id === language);
  const activeUsers = Array.from(users.values()).length + 1; // +1 for self

  // Generate dynamic CSS for remote cursor colors based on awareness states
  // ============================================
  // WebContainer File Management (JS mode)
  // ============================================

  // Boot WebContainer for file system
  useEffect(() => {
    if (!wc.booted && !wc.booting) {
      wc.boot();
    }
  }, [wc.booted, wc.booting]);

  // Open file from explorer
  const handleFileSelect = async (path) => {
    setActiveFile(path);
    if (!openFiles.includes(path)) {
      setOpenFiles((prev) => [...prev, path]);
    }
    // Read content from WebContainer or local state
    let content = '';
    if (wc.booted) {
      content = await wc.readFile(path) || '';
    } else {
      const file = wc.files[path];
      content = file?.content || '';
    }
    setFileContent(content);
    // Force Monaco to show the new content
    if (editorRef.current) {
      editorRef.current.setValue(content);
    }
  };

  // Close tab
  const handleCloseTab = (path) => {
    setOpenFiles((prev) => prev.filter((f) => f !== path));
    if (activeFile === path) {
      const remaining = openFiles.filter((f) => f !== path);
      setActiveFile(remaining[remaining.length - 1] || '');
    }
  };

  // Save current file to WebContainer
  const handleEditorChange = (value) => {
    setFileContent(value || '');
    if (wc.booted && activeFile) {
      wc.writeFile(activeFile, value || '');
    }
  };

  // Run current file in WebContainer
  const handleRunJS = async () => {
    setShowTerminal(true);
    if (wc.booted) {
      await wc.runFile(activeFile || 'index.js');
    }
  };

  // Create file
  const handleCreateFile = (name) => {
    wc.createFile(name, '');
    handleFileSelect(name);
  };

  // Create folder
  const handleCreateFolder = (name) => {
    wc.createFolder(name);
  };

  // Delete file
  const handleDeleteFile = (path) => {
    wc.deleteFile(path);
    handleCloseTab(path);
  };

  // ============================================

  const generateRemoteCursorStyles = () => {
    if (!awareness) return "";
    let css = "";
    awareness.getStates().forEach((state, clientID) => {
      if (clientID === ydoc.clientID) return;
      const color = state.user?.color || "#2563EB";
      const name = (state.user?.name || "Anonymous").replace(/"/g, '\\"');
      css += `
        .yRemoteSelection-${clientID} {
          background-color: ${color}30;
        }
        .yRemoteSelectionHead-${clientID} {
          border-left: 2px solid ${color};
          border-top: 2px solid ${color};
          position: absolute;
          height: 100%;
          box-sizing: border-box;
        }
        .yRemoteSelectionHead-${clientID}::after {
          content: "${name}";
          position: absolute;
          top: -18px;
          left: -2px;
          padding: 1px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
          font-family: system-ui, sans-serif;
          white-space: nowrap;
          pointer-events: none;
          background: ${color};
          color: #FFFFFF;
        }
      `;
    });
    return css;
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        borderLeft: "1px solid #DBEAFE",
        fontFamily: '"Poppins", system-ui, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          borderBottom: "1px solid #DBEAFE",
          background: "#FFFFFF",
          minHeight: 48,
          flexShrink: 0,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {/* Left — label + language selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#1E3A8A",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <FiCode size={16} />
            Code Editor
          </div>

          {/* Language selector */}
          <div ref={langMenuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowLangMenu((v) => !v)}
              aria-label="Select language"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "#EFF6FF",
                border: "1px solid #DBEAFE",
                borderRadius: 6,
                color: "#1E3A8A",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#DBEAFE")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#EFF6FF")
              }
            >
              {currentLang?.label || "JavaScript"}
              <FiChevronDown size={14} />
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  background: "#FFFFFF",
                  border: "1px solid #DBEAFE",
                  borderRadius: 10,
                  boxShadow: "0 8px 20px rgba(30, 58, 138, 0.12)",
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
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      background:
                        language === lang.id ? "#EFF6FF" : "transparent",
                      border: "none",
                      borderRadius: 6,
                      color: language === lang.id ? "#2563EB" : "#1E293B",
                      fontWeight: language === lang.id ? 600 : 400,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lang.id)
                        e.currentTarget.style.background = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang.id)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Files dropdown */}
          {wc.booted && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowExplorer(!showExplorer)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 10px',
                  background: showExplorer ? '#EFF6FF' : 'transparent',
                  border: '1px solid #DBEAFE',
                  borderRadius: 6,
                  color: showExplorer ? '#2563EB' : '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                📁 Files
                <FiChevronDown size={12} />
              </button>

              {showExplorer && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    width: 220,
                    maxHeight: 300,
                    background: '#FFFFFF',
                    border: '1px solid #DBEAFE',
                    borderRadius: 10,
                    boxShadow: '0 8px 20px rgba(30, 58, 138, 0.12)',
                    zIndex: 50,
                    overflow: 'auto',
                  }}
                >
                  <FileExplorer
                    files={wc.files}
                    selectedPath={activeFile}
                    onSelect={(path) => { handleFileSelect(path); setShowExplorer(false); }}
                    onCreateFile={handleCreateFile}
                    onCreateFolder={handleCreateFolder}
                    onDelete={handleDeleteFile}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — run button + file info + collaborators indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Run button */}
          <button
            onClick={() => {
              setShowTerminal(true);
              if ((language === 'javascript' || language === 'typescript') && wc.booted) {
                handleRunJS();
              } else {
                runCode(editorRef.current?.getValue() || yText.toString(), language);
              }
            }}
            disabled={isRunning}
            aria-label="Run code"
            onMouseEnter={(e) => {
              if (!isRunning) e.currentTarget.style.background = "#16A34A";
            }}
            onMouseLeave={(e) => {
              if (!isRunning) e.currentTarget.style.background = "#22C55E";
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: isRunning ? "#94A3B8" : "#22C55E",
              border: "none",
              borderRadius: 6,
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 700,
              cursor: isRunning ? "not-allowed" : "pointer",
              transition: "background 0.15s",
              boxShadow: isRunning
                ? "none"
                : "0 2px 6px rgba(34, 197, 94, 0.25)",
            }}
          >
            {isRunning ? (
              <FiLoader
                size={13}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <FiPlay size={13} />
            )}
            {isRunning ? "Running..." : "Run"}
          </button>

          {activeUsers > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#2563EB",
                background: "#EFF6FF",
                border: "1px solid #DBEAFE",
                padding: "3px 8px",
                borderRadius: 999,
                fontWeight: 600,
              }}
              title={`${activeUsers} users editing`}
            >
              <FiUsers size={12} />
              {activeUsers}
            </div>
          )}
          <span
            style={{
              fontSize: 11,
              color: "#64748B",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              padding: "3px 8px",
              borderRadius: 4,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            main.{FILE_EXTENSIONS[language] || "js"}
          </span>
        </div>
      </div>

      {/* Main Editor Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Editor + Terminal column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Tabs */}
          {openFiles.length > 0 && (
            <EditorTabs
              openFiles={openFiles}
              activeFile={activeFile}
              onSelect={handleFileSelect}
              onClose={handleCloseTab}
            />
          )}

          {/* Monaco Editor */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            {!editorReady && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: "#FFFFFF",
              zIndex: 5,
            }}
          >
            {editorFailed ? (
              <>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#FEF2F2",
                    color: "#DC2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  ✕
                </div>
                <span
                  style={{ color: "#1E293B", fontSize: 15, fontWeight: 600 }}
                >
                  Failed to load editor
                </span>
                <span
                  style={{
                    color: "#64748B",
                    fontSize: 13,
                    textAlign: "center",
                    maxWidth: 280,
                  }}
                >
                  Monaco Editor could not be loaded. Check your network
                  connection.
                </span>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: 8,
                    padding: "8px 20px",
                    background: "#2563EB",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </>
            ) : (
              <>
                <FiLoader
                  size={24}
                  style={{
                    color: "#2563EB",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span
                  style={{ color: "#64748B", fontSize: 14, fontWeight: 500 }}
                >
                  Loading collaborative editor...
                </span>
              </>
            )}
          </div>
        )}

        <Editor
          height="100%"
          language={language}
          defaultValue=""
          onMount={handleEditorDidMount}
          loading={null}
          options={{
            fontSize: 14,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
            fontLigatures: true,
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "all",
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            wordWrap: "on",
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

          {/* Terminal */}
          {showTerminal && (
            <div style={{ height: 180, flexShrink: 0, borderTop: '1px solid #334155' }}>
              <Terminal
                output={language === 'javascript' ? wc.terminalOutput : (output ? `${output.stdout}${output.stderr ? '\n' + output.stderr : ''}` : '')}
                isRunning={language === 'javascript' ? wc.isProcessRunning : isRunning}
                onClear={language === 'javascript' ? wc.clearTerminal : () => {}}
                onKill={language === 'javascript' ? wc.killProcess : () => {}}
              />
            </div>
          )}

        </div> {/* end Editor + Terminal column */}
      </div> {/* end Main Editor Area */}

      {/* Remote cursor styles + loader animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .yRemoteSelection {
          background-color: rgba(37, 99, 235, 0.15);
        }
        .yRemoteSelectionHead {
          position: absolute;
          border-left: 2px solid #2563EB;
          height: 100%;
          box-sizing: border-box;
        }

        ${generateRemoteCursorStyles()}
      `}</style>
    </div>
  );
};

export default CodeEditor;
