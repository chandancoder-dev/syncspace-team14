import { useState } from 'react';
import { FiFile, FiFolder, FiFolderPlus, FiFilePlus, FiTrash2, FiChevronRight, FiChevronDown } from 'react-icons/fi';


function TreeNode({ name, node, path, onSelect, onDelete, selectedPath }) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = node.type === 'folder';
  const fullPath = path ? `${path}/${name}` : name;
  const isSelected = selectedPath === fullPath;

  return (
    <div>
      <div
        onClick={() => {
          if (isFolder) setExpanded(!expanded);
          else onSelect(fullPath);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          paddingLeft: `${(fullPath.split('/').length - 1) * 12 + 8}px`,
          cursor: 'pointer',
          background: isSelected ? '#EFF6FF' : 'transparent',
          borderRadius: 4,
          fontSize: 13,
          color: isSelected ? '#2563EB' : '#1E293B',
          fontWeight: isSelected ? 600 : 400,
          transition: 'background 0.1s',
        }}
        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#F8FAFC'; }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
      >
        {isFolder && (expanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />)}
        {isFolder ? <FiFolder size={14} style={{ color: '#F59E0B' }} /> : <FiFile size={14} style={{ color: '#64748B' }} />}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(fullPath); }}
          style={{
            opacity: 0.4, border: 'none', background: 'transparent',
            cursor: 'pointer', color: '#EF4444', fontSize: 12,
            display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.4)}
          title="Delete"
        >
          <FiTrash2 size={12} />
        </button>
      </div>

      {isFolder && expanded && node.children && (
        <div>
          {Object.entries(node.children)
            .sort(([, a], [, b]) => (a.type === 'folder' ? -1 : 1) - (b.type === 'folder' ? -1 : 1))
            .map(([childName, childNode]) => (
              <TreeNode
                key={childName}
                name={childName}
                node={childNode}
                path={fullPath}
                onSelect={onSelect}
                onDelete={onDelete}
                selectedPath={selectedPath}
              />
            ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN: FILE EXPLORER
// ============================================

export default function FileExplorer({ files, selectedPath, onSelect, onCreateFile, onCreateFolder, onDelete }) {
  const [newName, setNewName] = useState('');
  const [showInput, setShowInput] = useState(null); // 'file' | 'folder' | null

  const handleCreate = () => {
    if (!newName.trim()) return;
    if (showInput === 'file') onCreateFile(newName.trim());
    else onCreateFolder(newName.trim());
    setNewName('');
    setShowInput(null);
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        borderRight: '1px solid #DBEAFE',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          borderBottom: '1px solid #DBEAFE',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A8A', letterSpacing: 0.3 }}>
          FILES
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setShowInput(showInput === 'file' ? null : 'file')}
            title="New File"
            style={{
              width: 24, height: 24, borderRadius: 4, border: 'none',
              background: showInput === 'file' ? '#EFF6FF' : 'transparent',
              color: '#475569', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <FiFilePlus size={14} />
          </button>
          <button
            onClick={() => setShowInput(showInput === 'folder' ? null : 'folder')}
            title="New Folder"
            style={{
              width: 24, height: 24, borderRadius: 4, border: 'none',
              background: showInput === 'folder' ? '#EFF6FF' : 'transparent',
              color: '#475569', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <FiFolderPlus size={14} />
          </button>
        </div>
      </div>

      {/* New file/folder input */}
      {showInput && (
        <div style={{ padding: '6px 12px', borderBottom: '1px solid #DBEAFE' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowInput(null); }}
              placeholder={showInput === 'file' ? 'filename.js' : 'folder-name'}
              style={{
                flex: 1, padding: '4px 8px', fontSize: 12,
                border: '1px solid #DBEAFE', borderRadius: 4, outline: 'none',
              }}
            />
            <button
              onClick={handleCreate}
              style={{
                padding: '4px 8px', fontSize: 11, fontWeight: 600,
                background: '#2563EB', color: '#fff', border: 'none',
                borderRadius: 4, cursor: 'pointer',
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* File tree */}
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 4px' }}>
        {Object.entries(files)
          .sort(([, a], [, b]) => (a.type === 'folder' ? -1 : 1) - (b.type === 'folder' ? -1 : 1))
          .map(([name, node]) => (
            <TreeNode
              key={name}
              name={name}
              node={node}
              path=""
              onSelect={onSelect}
              onDelete={onDelete}
              selectedPath={selectedPath}
            />
          ))}
      </div>
    </div>
  );
}
