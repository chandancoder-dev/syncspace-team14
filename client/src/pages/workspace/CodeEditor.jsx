import React from 'react';
import { FiCode } from 'react-icons/fi';

const CodeEditor = () => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: '#FFFFFF',
        borderLeft: '1px solid #DBEAFE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Poppins", system-ui, sans-serif',
        padding: 24,
      }}
    >
      {/* Icon tile */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: '#EFF6FF',
          border: '1px solid #DBEAFE',
          color: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          marginBottom: 20,
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
        }}
      >
        <FiCode />
      </div>

      {/* Status badge */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: '#2563EB',
          background: '#DBEAFE',
          padding: '3px 10px',
          borderRadius: 999,
          marginBottom: 12,
        }}
      >
        In Development
      </span>

      {/* Title */}
      <h2
        style={{
          color: '#1E3A8A',
          fontWeight: 700,
          fontSize: 22,
          margin: 0,
          marginBottom: 8,
          letterSpacing: -0.2,
        }}
      >
        Code Editor
      </h2>

      {/* Description */}
      <p
        style={{
          color: '#64748B',
          fontSize: 14,
          textAlign: 'center',
          maxWidth: 320,
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        Real-time collaborative code editing powered by Monaco and Yjs is coming soon. Draw on the
        whiteboard while we build this out.
      </p>
    </div>
  );
};

export default CodeEditor;
