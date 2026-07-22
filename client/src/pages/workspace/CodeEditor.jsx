import React from 'react';

const CodeEditor = () => {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      background: '#0F172A',
      color: '#CBD5E1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: 15,
      gap: 10,
      borderLeft: '1px solid #334155',
    }}>
      <span style={{ fontSize: 38, color: '#2563EB' }}>{'</>'}</span>
      <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 16 }}>Code Editor</span>
      <span style={{ color: '#CBD5E1', fontSize: 13 }}>Coming soon — Monaco + Yjs</span>
    </div>
  );
};

export default CodeEditor;
