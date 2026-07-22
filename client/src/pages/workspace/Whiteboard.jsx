import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line, Rect, Circle, Arrow, Text, Transformer } from 'react-konva';
import * as Y from 'yjs';

const TOOLS = {
  SELECT: 'select',
  PENCIL: 'pencil',
  RECT:   'rect',
  CIRCLE: 'circle',
  LINE:   'line',
  ARROW:  'arrow',
  TEXT:   'text',
  ERASER: 'eraser',
};

const TOOL_ICONS = {
  [TOOLS.SELECT]: '⬡',
  [TOOLS.PENCIL]: '✏️',
  [TOOLS.RECT]:   '▭',
  [TOOLS.CIRCLE]: '◯',
  [TOOLS.LINE]:   '╱',
  [TOOLS.ARROW]:  '➜',
  [TOOLS.TEXT]:   'T',
  [TOOLS.ERASER]: '⌫',
};


const Whiteboard = ({ ydoc: externalYdoc, users = new Map(), emitCursor, onLeave } = {}) => {
  const ydocRef = useRef(externalYdoc || new Y.Doc());
  const ydoc    = ydocRef.current;
  const yShapes = ydoc.getArray('shapes');


  
  const [shapes, setShapes]  = useState(() => yShapes.toArray());
  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [selectedId, setSelectedId]= useState(null);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor]= useState(null);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [editingText, setEditingText] = useState(null);
  const [stageSize, setStageSize]= useState({ width: 800, height: 600 });

  const strokeColorRef = useRef('#2563EB');
  const fillColorRef = useRef(null);
  const strokeWidthRef = useRef(3);
  const undoManagerRef = useRef(new Y.UndoManager(yShapes));
  const stageRef = useRef();
  const transformerRef = useRef();
  const containerRef   = useRef();
  const isDrawing= useRef(false);
  const currentShapeId = useRef(null);

  const setStroke = (v) => { strokeColorRef.current = v; setStrokeColor(v); };
  const setFill   = (v) => { fillColorRef.current   = v; setFillColor(v);   };
  const setWidth  = (v) => { strokeWidthRef.current = v; setStrokeWidth(v); };

  const makeId = () => Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    const obs = () => setShapes(yShapes.toArray());
    yShapes.observe(obs);
    return () => yShapes.unobserve(obs);
  }, [yShapes]);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setStageSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne('#' + selectedId);
      if (node) { transformerRef.current.nodes([node]); transformerRef.current.getLayer().batchDraw(); }
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedId]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undoManagerRef.current.undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); undoManagerRef.current.redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const addShape    = (shape) => ydoc.transact(() => yShapes.push([shape]));
  const updateShape = (id, fn) => {
    const arr = yShapes.toArray();
    const idx = arr.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const updated = fn({ ...arr[idx] });
    ydoc.transact(() => { yShapes.delete(idx, 1); yShapes.insert(idx, [updated]); });
  };
  const removeShape = (id) => {
    const idx = yShapes.toArray().findIndex((s) => s.id === id);
    if (idx !== -1) ydoc.transact(() => yShapes.delete(idx, 1));
  };
  const clearCanvas = () => { ydoc.transact(() => yShapes.delete(0, yShapes.length)); setSelectedId(null); };
  const undo = () => undoManagerRef.current.undo();
  const redo = () => undoManagerRef.current.redo();

  const getPointerPos = () => {
    const p = stageRef.current.getPointerPosition();
    return { x: (p.x - position.x) / scale, y: (p.y - position.y) / scale };
  };

  const handleMouseDown = (e) => {
    if (tool === TOOLS.SELECT) {
      if (e.target === e.target.getStage()) setSelectedId(null);
      return;
    }
    isDrawing.current = true;
    const { x, y } = getPointerPos();
    const id = makeId();
    currentShapeId.current = id;

    const sc = strokeColorRef.current;
    const sw = strokeWidthRef.current;
    const fc = fillColorRef.current;
    let shape = null;

    if (tool === TOOLS.PENCIL || tool === TOOLS.ERASER) {
      shape = { id, type: 'pencil', points: [x, y],
        stroke: tool === TOOLS.ERASER ? '#ffffff' : sc,
        strokeWidth: tool === TOOLS.ERASER ? sw * 4 : sw,
        lineCap: 'round', lineJoin: 'round', tension: 0.5 };
    } else if (tool === TOOLS.RECT) {
      shape = { id, type: 'rect', x, y, width: 0, height: 0, stroke: sc, strokeWidth: sw, fill: fc };
    } else if (tool === TOOLS.CIRCLE) {
      shape = { id, type: 'circle', x, y, radius: 0, stroke: sc, strokeWidth: sw, fill: fc };
    } else if (tool === TOOLS.LINE) {
      shape = { id, type: 'line', points: [x, y, x, y], stroke: sc, strokeWidth: sw, lineCap: 'round' };
    } else if (tool === TOOLS.ARROW) {
      shape = { id, type: 'arrow', points: [x, y, x, y], stroke: sc, strokeWidth: sw, fill: sc };
    } else if (tool === TOOLS.TEXT) {
      const absPos = stageRef.current.getPointerPosition();
      setTimeout(() => setEditingText({ id, x: absPos.x, y: absPos.y, stageX: x, stageY: y, text: '' }), 10);
      isDrawing.current = false;
      return;
    }
    if (shape) addShape(shape);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentShapeId.current) return;
    e.evt.preventDefault();
    const { x, y } = getPointerPos();
    const id = currentShapeId.current;
    if (emitCursor) emitCursor({ x, y });
    updateShape(id, (s) => {
      if (s.type === 'pencil') return { ...s, points: [...s.points, x, y] };
      if (s.type === 'rect')   return { ...s, width: x - s.x, height: y - s.y };
      if (s.type === 'circle') { const dx = x - s.x, dy = y - s.y; return { ...s, radius: Math.sqrt(dx * dx + dy * dy) }; }
      if (s.type === 'line' || s.type === 'arrow') return { ...s, points: [s.points[0], s.points[1], x, y] };
      return s;
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const id = currentShapeId.current;
    currentShapeId.current = null;
    const shape = yShapes.toArray().find((s) => s.id === id);
    if (shape) {
      const tiny =
        (shape.type === 'rect'   && (Math.abs(shape.width) <= 2 || Math.abs(shape.height) <= 2)) ||
        (shape.type === 'circle' && shape.radius <= 2) ||
        (shape.type === 'pencil' && shape.points.length <= 2);
      if (tiny) removeShape(id);
    }
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const by = 1.15;
    const stage = stageRef.current;
    const old = stage.scaleX();
    const ptr = stage.getPointerPosition();
    const pt  = { x: (ptr.x - stage.x()) / old, y: (ptr.y - stage.y()) / old };
    const ns  = e.evt.deltaY < 0 ? Math.min(old * by, 5) : Math.max(old / by, 0.2);
    setScale(ns);
    setPosition({ x: ptr.x - pt.x * ns, y: ptr.y - pt.y * ns });
  };

  const handleDragEnd = (id, e) => {
    const { x, y } = e.target.attrs;
    updateShape(id, (s) => ({ ...s, x, y }));
  };

  const commitText = () => {
    if (!editingText) return;
    if (editingText.text.trim()) {
      addShape({ id: editingText.id, type: 'text', x: editingText.stageX, y: editingText.stageY,
        text: editingText.text, fontSize: 16, fill: strokeColorRef.current });
    }
    setEditingText(null);
  };

  const renderShape = (shape) => {
    const common = {
      key: shape.id, id: shape.id,
      draggable: tool === TOOLS.SELECT,
      onClick:   tool === TOOLS.SELECT ? () => setSelectedId(shape.id) : undefined,
      onTap:     tool === TOOLS.SELECT ? () => setSelectedId(shape.id) : undefined,
      onDragEnd: (e) => handleDragEnd(shape.id, e),
    };
    switch (shape.type) {
      case 'pencil': return (
        <Line {...common} points={shape.points} stroke={shape.stroke} strokeWidth={shape.strokeWidth}
          lineCap={shape.lineCap} lineJoin={shape.lineJoin} tension={shape.tension}
          globalCompositeOperation={shape.stroke === '#ffffff' ? 'destination-out' : 'source-over'} />
      );
      case 'rect': return (
        <Rect {...common} x={shape.x} y={shape.y} width={shape.width} height={shape.height}
          stroke={shape.stroke} strokeWidth={shape.strokeWidth} fill={shape.fill || undefined} />
      );
      case 'circle': return (
        <Circle {...common} x={shape.x} y={shape.y} radius={shape.radius || 0}
          stroke={shape.stroke} strokeWidth={shape.strokeWidth} fill={shape.fill || undefined} />
      );
      case 'line': return (
        <Line {...common} points={shape.points} stroke={shape.stroke}
          strokeWidth={shape.strokeWidth} lineCap={shape.lineCap} />
      );
      case 'arrow': return (
        <Arrow {...common} points={shape.points} stroke={shape.stroke}
          strokeWidth={shape.strokeWidth} fill={shape.fill} />
      );
      case 'text': return (
        <Text {...common} x={shape.x} y={shape.y} text={shape.text}
          fontSize={shape.fontSize} fill={shape.fill}
          onDblClick={() => {
            const node = stageRef.current.findOne('#' + shape.id);
            const abs  = node.getAbsolutePosition();
            setEditingText({ id: shape.id, x: abs.x, y: abs.y, stageX: shape.x, stageY: shape.y, text: shape.text });
            removeShape(shape.id);
          }} />
      );
      default: return null;
    }
  };

  const renderRemoteCursors = () =>
    Array.from(users.entries()).map(([sid, { user, cursor }]) => {
      if (!cursor) return null;
      const color = user?.color || '#888';
      return (
        <div key={sid} style={{ position: 'absolute', left: cursor.x * scale + position.x, top: cursor.y * scale + position.y, pointerEvents: 'none', zIndex: 30 }}>
          <svg width="16" height="20" viewBox="0 0 16 20">
            <path d="M0 0 L0 14 L4 10 L8 18 L10 17 L6 9 L12 9 Z" fill={color} stroke="#fff" strokeWidth="1" />
          </svg>
          <div style={{ position: 'absolute', top: 14, left: 12, background: color, color: '#fff',
            fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
            whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            {user?.name || 'Unknown'}
          </div>
        </div>
      );
    });

  const toolBtnStyle = (active) => ({
    width: 38, height: 38, borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: active ? '#5473b8a1' : '#c6d2e8c4',
    color:      active ? '#ffffff' : '#374151',
    boxShadow:  active ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
    transition: 'all 0.15s',
  });

  const iconBtnStyle = (danger = false) => ({
    width: 32, height: 32, borderRadius: '6px', border: '1px solid #E5E7EB',
    cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: danger ? '#FEF2F2' : '#F3F4F6',
    color:      danger ? '#EF4444' : '#374151',
    transition: 'background 0.12s',
  });

  const dividerStyle = { width: 1, height: 28, background: '#E5E7EB', margin: '0 4px', flexShrink: 0 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%',
      background: '#F9FAFB', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
        background: '#ffffff', borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', zIndex: 10, minHeight: 58, flexWrap: 'wrap' }}>

        {/* Tool buttons */}
        <div style={{ display: 'flex', gap: 3 }}>
          {Object.values(TOOLS).map((t) => (
            <button key={t} title={t} onClick={() => { setTool(t); setSelectedId(null); }}
              style={toolBtnStyle(tool === t)}>
              {TOOL_ICONS[t]}
            </button>
          ))}
        </div>

        <div style={dividerStyle} />

        {/* Stroke color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11, color: '#6B7280', userSelect: 'none' }}>Stroke</span>
          <input type="color" value={strokeColor} onChange={(e) => setStroke(e.target.value)}
            style={{ width: 38, height: 38, border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 2, background: '#c6d2e8c4' }} />
        </div>

        {/* Fill color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11, color: '#6B7280', userSelect: 'none' }}>Fill</span>
          <input type="color" value={fillColor ?? '#ffffff'} onChange={(e) => setFill(e.target.value)}
            style={{ width: 38, height: 38, border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 2, background: '#c6d2e8c4' }} />
          <button onClick={() => setFill(null)} title="No fill"
            style={toolBtnStyle(fillColor === null)}>
            ∅
          </button>
        </div>

        <div style={dividerStyle} />

        {/* Stroke width */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#6B7280', userSelect: 'none' }}>Width</span>
          <input type="range" min={1} max={20} value={strokeWidth}
            onChange={(e) => setWidth(Number(e.target.value))}
            style={{ width: 80, accentColor: '#2563EB' }} />
          <span style={{ fontSize: 11, color: '#6B7280', minWidth: 28 }}>{strokeWidth}px</span>
        </div>

        <div style={dividerStyle} />

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => setScale((s) => Math.min(s * 1.2, 5))} title="Zoom In" style={toolBtnStyle(false)}>+</button>
          <span style={{ fontSize: 11, color: '#6B7280', minWidth: 40, textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.max(s / 1.2, 0.2))} title="Zoom Out" style={toolBtnStyle(false)}>−</button>
          <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} title="Reset" style={toolBtnStyle(false)}>⌖</button>
        </div>

        <div style={dividerStyle} />

        {/* Undo / Redo / Clear */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={undo}        title="Undo (Ctrl+Z)" style={toolBtnStyle(false)}>↩</button>
          <button onClick={redo}        title="Redo (Ctrl+Y)" style={toolBtnStyle(false)}>↪</button>
          <button onClick={clearCanvas} title="Clear All"
            style={{ ...toolBtnStyle(false), background: '#fde8e8', color: '#EF4444' }}>🗑</button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <Stage ref={stageRef}
          width={stageSize.width} height={stageSize.height}
          scaleX={scale} scaleY={scale} x={position.x} y={position.y}
          style={{ background: '#ffffff' }}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}
          onWheel={handleWheel}>
          <Layer>
            {shapes.length === 0 && (
              <Text text="Click a tool above and start drawing…" x={20} y={20} fontSize={14} fill="#9CA3AF" />
            )}
            {shapes.map(renderShape)}
            {tool === TOOLS.SELECT && (
              <Transformer ref={transformerRef}
                boundBoxFunc={(o, n) => (n.width < 5 || n.height < 5 ? o : n)} />
            )}
          </Layer>
        </Stage>

        {renderRemoteCursors()}

        {editingText && (
          <textarea autoFocus value={editingText.text}
            onChange={(e) => setEditingText((p) => ({ ...p, text: e.target.value }))}
            onBlur={commitText}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitText(); }
              if (e.key === 'Escape') setEditingText(null);
            }}
            style={{ position: 'absolute', top: editingText.y, left: editingText.x,
              minWidth: 120, minHeight: 36, fontSize: 16, color: strokeColor,
              background: 'rgba(255,255,255,0.95)', border: '1.5px dashed #2563EB',
              borderRadius: '6px', padding: '3px 8px', outline: 'none', resize: 'both',
              zIndex: 20, fontFamily: 'system-ui, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.10)' }} />
        )}
      </div>

      {onLeave && null}
    </div>
  );
};

export default Whiteboard;
