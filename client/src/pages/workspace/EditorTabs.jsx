import { FiX } from 'react-icons/fi';

export default function EditorTabs({ openFiles, activeFile, onSelect, onClose }) {
  if (openFiles.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #DBEAFE',
        background: '#F8FAFC',
        overflowX: 'auto',
        flexShrink: 0,
      }}
    >
      {openFiles.map((filePath) => {
        const fileName = filePath.split('/').pop();
        const isActive = activeFile === filePath;

        return (
          <div
            key={filePath}
            onClick={() => onSelect(filePath)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#2563EB' : '#64748B',
              background: isActive ? '#FFFFFF' : 'transparent',
              borderRight: '1px solid #DBEAFE',
              borderBottom: isActive ? '2px solid #2563EB' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = '#EFF6FF';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span>{fileName}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(filePath); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 16, height: 16, borderRadius: 3,
                border: 'none', background: 'transparent',
                color: '#94A3B8', cursor: 'pointer',
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
            >
              <FiX size={10} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
