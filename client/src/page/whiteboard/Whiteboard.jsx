import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Text, Transformer } from 'react-konva';



const TOOLS = {
  SELECT: "select",
  PENCIL: "pencil",
  RECT: "rect",
  CIRCLE: "circle",
  LINE: "line",
  ARROW: "arrow",
  TEXT: "text",
  ERASER: "eraser",
};

const TOOL_ICONS = {
  [TOOLS.SELECT]: "⬡",
  [TOOLS.PENCIL]: "✏️",
  [TOOLS.RECT]: "▭",
  [TOOLS.CIRCLE]: "◯",
  [TOOLS.LINE]: "╱",
  [TOOLS.ARROW]: "➜",
  [TOOLS.TEXT]: "T",
  [TOOLS.ERASER]: "⌫",
};

const WhiteBoard = () => {
    const [shapes, setShapes] = useState([]);
    const [tool, setTool] = useState('select');
    const [selectedId, setSelectedId] = useState(null);
    const [strokeColor, setStrokeColor] = useState('#000000');
    const [fillColor, setFillColor] = useState('transparent');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const transformerRef = useRef();

    const handleMouseDown = (e) => {
        // Logic to handle mouse down event for drawing shapes
    };

    const handleMouseMove = (e) => {
        // Logic to handle mouse move event for drawing shapes
    };  

    const handleMouseUp = (e) => {
        // Logic to handle mouse up event for drawing shapes
    };

    const handleWheel = (e) => {
        // Logic to handle zooming in/out with mouse wheel
    };

    const handleDragEnd = (id, e) => {
        // Logic to handle shape dragging
    };




    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '50%', background: '#f5f5f5', overflow: 'hidden', fontFamily: 'sans-serif' }}>
           
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", 
                background: "#ffffff", borderBottom: "1px solid #e0e0e0", flexWrap: "wrap", 
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)", zIndex: 10, minHeight: 52 }}>

           {/* Tool buttons */}
          <div style={{ display: "flex", gap: 4 }}>
            {Object.values(TOOLS).map((t) => (
              <button
                key={t}
                title={t}
                onClick={() => {
                  setTool(t);
                  setSelectedId(null); 
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  background: tool === t ? "#6c63ff" : "#f0f0f0",
                  color: tool === t ? "#fff" : "#444",
                  boxShadow: tool === t ? "0 2px 6px rgba(108,99,255,0.4)" : "none",
                  transition: "all 0.15s"
                }}
              >
                {TOOL_ICONS[t]}
              </button>
          ))}
 </div>
 {/* Stroke color */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: "#888" }}>Stroke</span>
          <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)}
            style={{ width: 32, height: 32, border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", padding: 2 }} />
        </div>

        {/* Fill color */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: "#888" }}>Fill</span>
          <input type="color" value={fillColor === "transparent" ? "#ffffff" : fillColor} onChange={(e) => setFillColor(e.target.value)}
            style={{ width: 32, height: 32, border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", padding: 2 }} />
          <button onClick={() => setFillColor("transparent")} title="No fill"
            style={{ height: 28, padding: "0 8px", borderRadius: 6, border: "1px solid #ddd", background: "#f0f0f0", cursor: "pointer", fontSize: 12, color: "#555" }}>
            ∅
          </button>
        </div>

        {/* Stroke width */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#888" }}>Width</span>
          <input type="range" min={1} max={20} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))}
            style={{ width: 80, accentColor: "#6c63ff" }} />
          <span style={{ fontSize: 11, color: "#888", minWidth: 28 }}>{strokeWidth}px</span>
        </div>

            </div>
            <h4 style={{color: '#b5a6a6',paddingTop: '10px'}}>Start Drawing .... </h4>
            {/* <Stage ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight - 52}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          style={{ background: "#ffffff" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}>

                
            </Stage> */}
            
    
        </div>
    );
};

export default WhiteBoard;

