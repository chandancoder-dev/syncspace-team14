import { useEffect, useRef } from 'react';
import { FiTerminal, FiTrash2, FiSquare } from 'react-icons/fi';

export default function Terminal({ output, isRunning, onClear, onKill }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0F172A',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          background: '#1E293B',
          borderBottom: '1px solid #334155',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiTerminal size={13} style={{ color: '#22C55E' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>
            Terminal
          </span>
          {isRunning && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 999,
                background: '#22C55E20',
                color: '#22C55E',
                border: '1px solid #22C55E40',
              }}
            >
              Running
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {isRunning && (
            <button
              onClick={onKill}
              title="Stop process"
              style={{
                width: 22, height: 22, borderRadius: 4,
                border: 'none', background: '#DC262620',
                color: '#EF4444', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FiSquare size={10} />
            </button>
          )}
          <button
            onClick={onClear}
            title="Clear terminal"
            style={{
              width: 22, height: 22, borderRadius: 4,
              border: 'none', background: '#334155',
              color: '#94A3B8', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <FiTrash2 size={10} />
          </button>
        </div>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '10px 12px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12,
          lineHeight: 1.7,
          color: '#E2E8F0',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {output || <span style={{ color: '#475569' }}>Terminal ready. Run a file or command.</span>}
      </div>
    </div>
  );
}
