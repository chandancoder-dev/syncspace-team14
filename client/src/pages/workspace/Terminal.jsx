import { useEffect, useRef, useState } from 'react';
import { FiTrash2, FiSquare, FiX } from 'react-icons/fi';

export default function Terminal({ output, isRunning, onClear, onKill, onCommand, onClose }) {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    if (onCommand) onCommand(command.trim());
    setCommand('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIdx);
      setCommand(history[history.length - 1 - newIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIdx);
      setCommand(newIdx === -1 ? '' : history[history.length - 1 - newIdx] || '');
    } else if (e.key === 'c' && e.ctrlKey && isRunning) {
      if (onKill) onKill();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      if (onClear) onClear();
    }
  };

  return (
    <div
      onClick={focusInput}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1E1E1E',
        overflow: 'hidden',
        fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      }}
    >
      {/* Header — VS Code style */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          height: 32,
          background: '#252526',
          borderBottom: '1px solid #3C3C3C',
          flexShrink: 0,
        }}
      >
        {/* Left — tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#CCCCCC',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              padding: '6px 12px',
              borderBottom: '1px solid #007ACC',
              background: '#1E1E1E',
            }}
          >
            Terminal
          </span>
          <span
            style={{
              fontSize: 11,
              color: '#808080',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              padding: '6px 12px',
            }}
          >
            {isRunning ? 'node' : 'bash'}
          </span>
        </div>

        {/* Right — actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isRunning && (
            <button
              onClick={(e) => { e.stopPropagation(); onKill(); }}
              title="Kill process (Ctrl+C)"
              style={btnStyle}
            >
              <FiSquare size={12} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            title="Clear (Ctrl+L)"
            style={btnStyle}
          >
            <FiTrash2 size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (onClose) onClose(); }}
            title="Close terminal"
            style={btnStyle}
          >
            <FiX size={12} />
          </button>
        </div>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 14px',
          fontSize: 13,
          lineHeight: 1.5,
          color: '#CCCCCC',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {output || (
          <span style={{ color: '#6A9955' }}>
            {`# Welcome to SyncSpace Terminal\n# Type commands below. Use ↑↓ for history.\n# Ctrl+C to kill, Ctrl+L to clear.\n\n`}
          </span>
        )}
      </div>

      {/* Input line */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 14px 8px',
          flexShrink: 0,
        }}
      >
        <span style={{ color: '#007ACC', fontSize: 13, marginRight: 8, fontWeight: 600 }}>
          $
        </span>
        <input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRunning ? '(process running...)' : 'Type command...'}
          disabled={isRunning}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#CCCCCC',
            fontSize: 13,
            fontFamily: 'inherit',
            caretColor: '#AEAFAD',
            opacity: isRunning ? 0.5 : 1,
          }}
        />
      </form>
    </div>
  );
}

// Button style for header actions
const btnStyle = {
  width: 22,
  height: 22,
  borderRadius: 4,
  border: 'none',
  background: 'transparent',
  color: '#808080',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.1s, background 0.1s',
};
