import React from 'react';


const CodeEditor = () => {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      background: '#3c3b3b',
      color: '#b8afaf',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: 15,
      gap: 8,
    }}>
      <span style={{ fontSize: 36 }}>{'</>'}</span>
      <span>Code Editor — coming soon</span>
    </div>
  );
};

export default CodeEditor;
