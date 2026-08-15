# SyncSpace — Project Documentation

---

## Document Information

| Field | Details |
|-------|---------|
| Project Name | SyncSpace — Real-Time Collaborative Whiteboard & Code Editor |
| Domain | Developer Tools & Real-Time Collaboration |
| Team | Team 14 |
| Date | August 2026 |
| Version | 2.0 |
| Repository | https://github.com/chandancoder-dev/syncspace-team14 |

### Team Members

| Name | Role / Module |
|------|--------------|
| Sumit Verma | Workspace (Whiteboard, Code Editor, Real-Time Sync, Replay, Terminal) |
| Chandan K R | Landing Page UI, Chat Panel, Features Section, Footer |
| Pratiksha Dighe | Dashboard, Video Call, Room UI, Navbar |
| Nilabha (Neel) | AI Chat Assistant, Forgot Password, Backend Chat System |
| Deepan | Register Page, Initial Auth Setup |

---

## Table of Contents

1. Introduction
2. Objectives
3. Problem Statement
4. Scope of Work
5. System Architecture
6. Technology Stack
7. Module Description
8. Database Design
9. Implementation Details
10. Key Features
11. Challenges & Solutions
12. Testing
13. Future Enhancements
14. Conclusion
15. References

---

## 1. Introduction

SyncSpace is a real-time collaborative workspace application that enables multiple users to simultaneously draw diagrams on a shared whiteboard, write code in a collaborative editor, communicate via chat, and conduct video calls — all within an isolated room-based session with zero conflicts and instant synchronization.

The application demonstrates advanced concepts in distributed systems including WebSocket communication, Conflict-free Replicated Data Types (CRDTs), WebRTC video calling, and real-time state synchronization, packaged in a professional dual-pane interactive IDE comparable to modern SaaS tools like Figma, CodeSandbox, and Google Meet.

---

## 2. Objectives

- Design and implement a real-time collaborative platform using WebSockets and CRDTs
- Build an interactive whiteboard with multiple drawing tools synced across users
- Integrate a collaborative code editor (Monaco/VS Code engine) with real-time editing
- Implement code execution supporting 8 programming languages
- Enable real-time chat with typing indicators
- Implement video calling using WebRTC
- Build an AI-powered chat assistant for developer help
- Enable session persistence so work survives server restarts
- Build a session replay feature for reviewing collaboration history
- Ensure secure access via JWT authentication
- Deliver a professional, responsive UI matching industry standards

---

## 3. Problem Statement

Building applications where multiple users simultaneously edit shared documents or drawings requires advanced synchronization algorithms beyond traditional MERN request-response patterns.

Traditional approaches face challenges:
- **Conflicts**: Two users editing the same line → data loss
- **Latency**: HTTP request-response adds delay
- **Consistency**: Ensuring all clients have identical state
- **Scalability**: Managing many concurrent connections
- **Communication**: Need for real-time text and video communication alongside collaboration

SyncSpace addresses these using:
- **Socket.io** for persistent bi-directional communication
- **Yjs (CRDT)** for mathematically guaranteed conflict-free merging
- **WebRTC** for peer-to-peer video calling
- **Room-based isolation** for team-level privacy
- **MongoDB** for persistent state storage

---

## 4. Scope of Work

### Module Distribution

| Module | Owner | Description |
|--------|-------|-------------|
| Workspace & Sync Engine | Sumit Verma | Whiteboard, Code Editor, Yjs sync, Replay, Terminal, File Explorer |
| Landing Page & Chat | Chandan K R | Home, About, Features, Footer UI, Chat Panel with typing indicators |
| Dashboard & Video Call | Pratiksha Dighe | Dashboard UI, Room cards, Video Call (WebRTC), Navbar |
| AI Assistant & Auth | Nilabha (Neel) | AI Chat bot, Forgot Password, Reset Password backend |
| Registration | Deepan | Register page, initial validation |

---

## 5. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                          │
│                                                                   │
│  React App                                                        │
│  ├── Landing Pages (Home, About, Features)                       │
│  ├── Auth (Login, Register, Forgot Password)                     │
│  ├── Dashboard (Room management, Stats)                          │
│  ├── Workspace                                                    │
│  │   ├── Whiteboard (Konva.js + Y.Array)                        │
│  │   ├── Code Editor (Monaco + y-monaco + Y.Text)               │
│  │   ├── Terminal (WebContainer / Backend execution)             │
│  │   ├── File Explorer                                           │
│  │   └── Replay (Timeline scrubber)                              │
│  ├── Chat Panel (Socket.io real-time messaging)                  │
│  ├── Video Call (WebRTC + Socket.io signaling)                   │
│  ├── AI Assistant (Keyword-based chatbot)                        │
│  └── WebContainer (Browser-based Node.js for JS/TS)             │
│                                                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │ WebSocket (Socket.io) + HTTP (REST)
                         │
┌────────────────────────┴────────────────────────────────────────┐
│                         SERVER (Node.js)                          │
│                                                                   │
│  Express.js                                                       │
│  ├── REST API                                                     │
│  │   ├── Auth (Register, Login, Reset Password)                  │
│  │   ├── Rooms (Create, Join, End, Invite)                       │
│  │   ├── Code Execution (8 languages)                            │
│  │   ├── Replay (Get update logs)                                │
│  │   ├── Dashboard Stats                                         │
│  │   └── AI Chat (Keyword matching)                              │
│  ├── Socket.io Server                                             │
│  │   ├── Room Handler (Yjs sync, awareness, persistence)         │
│  │   └── Video Handler (WebRTC signaling)                        │
│  └── Middleware (JWT auth)                                        │
│                                                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│                         DATABASE (MongoDB)                        │
│                                                                   │
│  Collections:                                                     │
│  ├── users           (authentication, profiles)                  │
│  ├── rooms           (room metadata, lifecycle, participants)    │
│  ├── yjsdocuments    (binary Yjs state snapshots)               │
│  └── yjsupdatelogs   (edit history for replay)                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow — Real-Time Sync

```
User A edits (draws/types)
    │
    ├── Yjs update event fires
    ├── Origin check (not 'remote'?) → emit 'yjs-update' via Socket.io
    │
    ▼
Server receives
    ├── Y.applyUpdate(serverDoc)
    ├── Broadcasts to all others in room
    ├── Debounced save to MongoDB (2s)
    └── Logs to YjsUpdateLog (for replay)
    │
    ▼
User B receives
    ├── Y.applyUpdate(localDoc, data, 'remote')
    ├── Whiteboard: yShapes.observe() → re-render
    └── Code Editor: MonacoBinding → text updates
```

### Data Flow — Video Call (WebRTC)

```
User A clicks "Call"
    ├── getUserMedia() → camera/mic stream
    ├── socket.emit('join-video-room', roomId)
    │
    ▼
Server (videoHandler)
    ├── Relays signaling between peers
    │   ├── offer → answer → ICE candidates
    │
    ▼
User B receives
    ├── RTCPeerConnection established
    └── Direct P2P video/audio stream
```

---

## 6. Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| Vite | 8.1 | Build tool + dev server |
| Socket.io Client | 4.x | Real-time WebSocket communication |
| Yjs | 13.x | CRDT for conflict-free sync |
| y-monaco | 0.1.6 | Monaco ↔ Yjs binding |
| y-protocols | 1.x | Awareness protocol (cursors) |
| Monaco Editor | 0.56 | Code editor (VS Code engine) |
| Konva.js | 9.x | 2D canvas library (whiteboard) |
| @webcontainer/api | 1.6 | Browser-based Node.js runtime |
| React Router | 7.x | Client-side routing |
| Tailwind CSS | 4.x | Utility CSS framework |
| React Icons | 5.x | Icon system (Feather, Font Awesome) |
| Axios | 1.x | HTTP requests |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 24 | Server runtime |
| Express.js | 4.x | REST API framework |
| Socket.io | 4.x | WebSocket server |
| MongoDB + Mongoose | 8.x | Database + ODM |
| Yjs (server) | 13.x | Document state management |
| JWT (jsonwebtoken) | 9.x | Authentication tokens |
| bcrypt | 5.x | Password hashing |
| child_process | native | Code execution engine |

### Code Execution — Languages Supported

| Language | Execution Method | Runtime |
|----------|-----------------|---------|
| JavaScript | WebContainer (browser) | Node.js in WASM |
| TypeScript | WebContainer (browser) | Node.js --experimental-strip-types |
| Python | Backend server | python3 |
| Java | Backend server | javac + java (JDK 26) |
| C | Backend server | gcc (Apple Clang) |
| C++ | Backend server | g++ (Apple Clang) |
| Ruby | Backend server | ruby |
| Swift | Backend server | swift |

---

## 7. Module Description

### 7.1 Landing Pages (Chandan K R)

| Page | Description |
|------|-------------|
| Home | Hero section with CTA, feature highlights, navigation |
| About | Team information, project description |
| Features | Feature cards with hover animations, video/audio calling info |
| Footer | Quick links, contact info, social links |

### 7.2 Authentication (Team Effort)

| Feature | Owner | Description |
|---------|-------|-------------|
| Login | Chandan / Sumit | Email + password, JWT token, ?next= redirect |
| Register | Deepan / Sumit | Full Name, Username, Email, Password with validation |
| Forgot Password | Nilabha | Password reset via email verification |
| Protected Routes | Sumit | ProtectedRoute component, redirect to login with ?next= |
| Auth Context | Pratiksha | React Context for global auth state |
| Navbar (auth-aware) | Sumit / Pratiksha | Shows Dashboard/Logout when logged in, Login/Register when not |

### 7.3 Dashboard (Pratiksha Dighe)

| Component | Description |
|-----------|-------------|
| DNavbar | Dashboard-specific navbar with user info, notifications, logout |
| WelcomeCard | Welcome message, live stats (active rooms, online users) |
| ActionCard | Create Room / Join Room quick actions |
| RecentRooms | User's rooms with status, View Replay button |
| StatsCard | Statistics display |
| Rooms Page | Full room listing with history |

### 7.4 Workspace — Whiteboard (Sumit Verma)

| Feature | Description |
|---------|-------------|
| 8 Drawing Tools | Select, Pencil, Rectangle, Circle, Line, Arrow, Text, Eraser |
| Yjs Sync | Shapes in Y.Array — every edit syncs automatically |
| Remote Cursors | SVG overlay with user name + color |
| Responsive Toolbar | Horizontal (wide) or floating sidebar (narrow < 640px) |
| Fill-after-draw | Select shape → pick color → applies |
| Undo/Redo | Y.UndoManager tracks transactions |
| Zoom & Pan | Scroll wheel, reset button |
| Transformer | Select tool for resize/rotate |

### 7.5 Workspace — Code Editor (Sumit Verma)

| Feature | Description |
|---------|-------------|
| Monaco Editor | VS Code engine with IntelliSense, bracket colorization |
| y-monaco binding | Real-time collaborative editing via Y.Text |
| 8 Languages | Selector synced across all users via Y.Map |
| Code Execution | WebContainer (JS/TS), Backend (Python/Java/C/C++/Ruby/Swift) |
| File Explorer | Dropdown with create/delete files, dynamic per language |
| Multi-tab Editing | Open multiple files, switch between tabs |
| Remote Cursors | Colored cursor lines + name labels via awareness |
| Custom Theme | syncspace-light matching design palette |
| Error States | Monaco load failure (15s timeout) + retry |

### 7.6 Workspace — Terminal (Sumit Verma)

| Feature | Description |
|---------|-------------|
| VS Code Style | Dark theme (#1E1E1E), blue prompt, JetBrains Mono font |
| Interactive Input | Type commands, press Enter to execute |
| Command History | Arrow Up/Down for previous commands |
| Resizable | Drag top border to resize height |
| Keyboard Shortcuts | Ctrl+C kill, Ctrl+L clear |
| Dual Output | WebContainer output (JS/TS) or backend output (others) |

### 7.7 Workspace — Session Replay (Sumit Verma)

| Feature | Description |
|---------|-------------|
| Timeline Scrubber | Drag to any point in session history |
| Play/Pause | Auto-advance with speed control (0.5x - 8x) |
| Split View | SVG whiteboard replay + code viewer with line numbers |
| Cursor Tracking | Shows who made each edit with tool indicator |
| Context-aware Back | Workspace → workspace, Dashboard → dashboard |

### 7.8 Chat Panel (Chandan K R / Nilabha)

| Feature | Description |
|---------|-------------|
| Real-time Messaging | Socket.io based, instant delivery |
| Typing Indicators | Shows who is typing in real-time |
| Message History | Persisted per session |
| Draggable Float | When video is also open, chat becomes draggable floating panel |
| User Identity | Shows sender name with avatar |

### 7.9 AI Chat Assistant (Nilabha)

| Feature | Description |
|---------|-------------|
| Keyword Matching | Pre-defined Q&A for developer help |
| Contextual Responses | Based on common coding questions |
| Toggleable Panel | Opens on demand, doesn't interfere with workspace |

### 7.10 Video Call (Pratiksha Dighe)

| Feature | Description |
|---------|-------------|
| WebRTC | Peer-to-peer video/audio streams |
| Toggle Sidebar | Hidden by default, opens on "Call" button click |
| Camera/Mic Controls | Toggle on/off, visual indicators |
| Video Tiles | Grid layout with user avatars when camera off |
| Socket Signaling | Server relays offer/answer/ICE candidates |
| Leave Call | Returns to workspace without disconnecting from room |

### 7.11 Room Management (Sumit Verma / Pratiksha)

| Feature | Description |
|---------|-------------|
| Create Room | Name + optional description, generates unique Room ID |
| Join Room | Via Room ID or shared link |
| Room Lifecycle | Status: active/ended, host tracking, auto-participant |
| Invite System | Host shares link = invitation (JWT + Room ID = access) |
| Room Persistence | MongoDB Room model with participants and timestamps |

### 7.12 Real-Time Sync Engine (Sumit Verma)

| Feature | Description |
|---------|-------------|
| Socket.io Rooms | Isolated sessions per team |
| Yjs Document | Y.Doc per room with Y.Array, Y.Text, Y.Map |
| Origin-based Echo Prevention | Remote updates don't re-broadcast |
| Awareness Protocol | Cursor positions synced via y-protocols |
| Reconnection | Auto-reconnect (10 attempts), full state re-sync |
| Deterministic Colors | Same user = same cursor color always |
| Debounced Persistence | Save to MongoDB 2s after last edit |
| Update Logging | Every edit logged for replay |

---

## 8. Database Design

### Users Collection

```
{
  _id: ObjectId,
  name: String (required),
  username: String (required, unique),
  email: String (required, unique),
  password: String (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Rooms Collection

```
{
  _id: ObjectId,
  roomId: String (unique, indexed),
  name: String (required),
  description: String,
  status: "active" | "ended",
  createdBy: ObjectId (ref: User),
  participants: [{
    userId: ObjectId,
    name: String,
    joinedAt: Date
  }],
  endedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### YjsDocuments Collection

```
{
  _id: ObjectId,
  roomId: String (unique, indexed),
  state: Buffer (binary Yjs document state),
  createdAt: Date,
  updatedAt: Date
}
```

### YjsUpdateLogs Collection

```
{
  _id: ObjectId,
  roomId: String (indexed),
  update: Buffer (binary Yjs delta),
  userId: String,
  userName: String,
  timestamp: Date (indexed)
}
Compound Index: { roomId: 1, timestamp: 1 }
```

---

## 9. Implementation Details

### 9.1 CRDT Sync — Echo Loop Prevention

```javascript
// Mark remote updates to prevent infinite re-broadcast
socket.on('yjs-update', ({ update }) => {
  Y.applyUpdate(ydoc, new Uint8Array(update), 'remote');
});

ydoc.on('update', (update, origin) => {
  if (origin === 'remote') return; // don't re-broadcast
  socket.emit('yjs-update', { roomId, update: Array.from(update) });
});
```

### 9.2 Debounced Persistence

```javascript
function scheduleSave(roomId, ydoc) {
  clearTimeout(saveTimers.get(roomId));
  const timer = setTimeout(() => {
    const state = Buffer.from(Y.encodeStateAsUpdate(ydoc));
    YjsDocument.findOneAndUpdate({ roomId }, { state }, { upsert: true });
  }, 2000);
  saveTimers.set(roomId, timer);
}
```

### 9.3 Code Execution — Dual Mode

```javascript
// JavaScript/TypeScript → WebContainer (browser)
const container = await WebContainer.boot();
await container.fs.writeFile('/main.js', code);
const process = await container.spawn('node', ['main.js']);

// Python/Java/C/C++/Ruby/Swift → Backend
await writeFile(join(execDir, fileName), code);
if (config.compile) await executeWithTimeout(compileCmd, compileArgs);
const result = await executeWithTimeout(runCmd, runArgs, { timeout: 5000 });
```

### 9.4 WebRTC Video Call Signaling

```javascript
// Server (videoHandler.js)
socket.on("join-video-room", (roomId) => {
  socket.join(roomId);
  socket.to(roomId).emit("user-joined-video", socket.id);
});

socket.on("offer", ({ to, offer }) => {
  io.to(to).emit("offer", { from: socket.id, offer });
});

socket.on("answer", ({ to, answer }) => {
  io.to(to).emit("answer", { from: socket.id, answer });
});
```

### 9.5 AI Chat Assistant

```javascript
// Keyword-based matching from predefined Q&A dataset
export const processChat = (req, res) => {
  const { message } = req.body;
  for (let item of chatData) {
    if (item.keywords.some(keyword =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )) {
      return res.json({ reply: item.response });
    }
  }
  return res.json({ reply: "I'm not sure about that. Try asking differently." });
};
```

---

## 10. Key Features

| # | Feature | Module | Status |
|---|---------|--------|--------|
| 1 | Socket.io room infrastructure | Sync Engine | ✅ |
| 2 | Split-screen workspace UI | Workspace | ✅ |
| 3 | CRDT integration (Yjs) | Sync Engine | ✅ |
| 4 | Whiteboard (Konva.js, 8 tools) | Workspace | ✅ |
| 5 | Real-time shape sync | Sync Engine | ✅ |
| 6 | Remote cursor awareness | Workspace | ✅ |
| 7 | MongoDB persistence | Sync Engine | ✅ |
| 8 | Monaco + Yjs collaborative editing | Workspace | ✅ |
| 9 | JWT authentication | Auth | ✅ |
| 10 | Session replay with timeline | Workspace | ✅ |
| 11 | Code execution (8 languages) | Workspace | ✅ |
| 12 | WebContainer (browser Node.js) | Workspace | ✅ |
| 13 | File explorer + multi-tab | Workspace | ✅ |
| 14 | VS Code terminal | Workspace | ✅ |
| 15 | Real-time chat | Chat | ✅ |
| 16 | Typing indicators | Chat | ✅ |
| 17 | Video call (WebRTC) | Video | ✅ |
| 18 | AI chat assistant | AI | ✅ |
| 19 | Forgot/Reset password | Auth | ✅ |
| 20 | Dashboard with room stats | Dashboard | ✅ |
| 21 | Room lifecycle (active/ended) | Rooms | ✅ |
| 22 | Responsive landing pages | Landing | ✅ |
| 23 | Reconnection handling | Sync Engine | ✅ |
| 24 | Access control (link = invitation) | Auth | ✅ |
| 25 | Draggable floating chat | Workspace | ✅ |

---

## 11. Challenges & Solutions

| # | Challenge | Cause | Solution |
|---|-----------|-------|----------|
| 1 | Echo loop (infinite sync) | Remote updates re-broadcast | Origin parameter on Y.applyUpdate |
| 2 | Duplicate code on join | Seed before sync-state arrives | 500ms delay before seeding |
| 3 | Stale closure in React | Color picker reading old state | useRef for current value |
| 4 | MonacoBinding conflicts | Binding fights manual setValue | Destroy → update → recreate |
| 5 | Cursor lingering after leave | Awareness 30s default timeout | removeAwarenessStates on user-left |
| 6 | Logout redirect loop | React re-render during disconnect | window.location.href |
| 7 | Chat clipping when both panels open | Fixed width exceeds container | Floating draggable panel |
| 8 | macOS git case-sensitivity | Navbar.jsx vs navbar.jsx | Rename via temp file |
| 9 | WebContainer module resolution | y-monaco can't find monaco-editor | Vite resolve alias |
| 10 | Main branch wiped by force-push | Teammate force-pushed standalone project | Restored from local history |

---

## 12. Testing

### Manual Test Cases

| # | Test Case | Steps | Expected | Result |
|---|-----------|-------|----------|--------|
| 1 | Two-tab sync (shapes) | Open 2 tabs, draw in Tab A | Appears in Tab B | ✅ |
| 2 | Two-tab sync (code) | Type in Tab A | Text in Tab B | ✅ |
| 3 | Remote cursors | Move cursor in Tab A | Visible in Tab B | ✅ |
| 4 | Persistence | Close tabs → reopen | Content restored | ✅ |
| 5 | Code execution (JS) | Run JavaScript | Output in terminal | ✅ |
| 6 | Code execution (Python) | Run Python | Output from server | ✅ |
| 7 | Reconnection | Disconnect → reconnect | Auto-syncs | ✅ |
| 8 | Session replay | Scrub timeline | See evolution | ✅ |
| 9 | Chat messaging | Send message | Others receive | ✅ |
| 10 | Video call | Start call | Video tiles appear | ✅ |
| 11 | Login/Register | Create account, login | Token stored, dashboard loads | ✅ |
| 12 | Protected routes | Access /workspace without login | Redirect to /login | ✅ |

### Build Status

```bash
$ cd client && npm run build
✓ built in ~1s (0 errors)

$ cd server && node --check src/app.js
✓ No syntax errors
```

---

## 13. Future Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Docker sandboxing | Secure code execution in containers | High |
| Live preview (iframe) | Run full React/Express apps with preview | Medium |
| Screen sharing | WebRTC screen capture stream | Medium |
| npm install support | Install packages in WebContainer | Medium |
| Error boundary | Graceful crash handling | Medium |
| Rate limiting | Prevent code execution abuse | Medium |
| Redis pub/sub | Horizontal scaling of socket servers | Low |
| Mobile app | React Native or PWA | Low |
| Export | Download whiteboard as PNG/SVG | Low |
| Collaborative debugging | Shared breakpoints | Low |

---

## 14. Conclusion

SyncSpace demonstrates a production-grade real-time collaborative system built on modern web technologies. The project successfully covers:

- **Zero-conflict collaboration** using Yjs CRDT — mathematically guaranteed convergence
- **Sub-100ms sync latency** via WebSocket (Socket.io)
- **8 programming languages** executable with WebContainer + backend engine
- **Video calling** using WebRTC for face-to-face communication
- **Real-time chat** with typing indicators
- **AI assistant** for developer productivity
- **Session persistence** — work survives server restarts
- **Session replay** — full history playback with cursor tracking
- **Professional UI** — matching complexity of Figma, CodeSandbox, and Google Meet

The architecture is modular and extensible — each module (whiteboard, editor, chat, video) operates independently while sharing the same sync infrastructure.

---

## 15. References

| Resource | URL |
|----------|-----|
| Yjs Documentation | https://docs.yjs.dev |
| Socket.io Documentation | https://socket.io/docs |
| Monaco Editor | https://microsoft.github.io/monaco-editor |
| Konva.js | https://konvajs.org |
| WebContainer API | https://webcontainers.io |
| WebRTC API | https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API |
| y-monaco | https://github.com/yjs/y-monaco |
| CRDT Paper (Shapiro et al.) | https://hal.inria.fr/inria-00609399 |
| JWT.io | https://jwt.io |
| Tailwind CSS | https://tailwindcss.com |

---

## Appendix A: API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/register | No | User registration |
| POST | /api/auth/login | No | User login (returns JWT) |
| POST | /api/auth/reset-password | No | Password reset |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/rooms | Yes | Create room |
| GET | /api/rooms | Yes | Get user's rooms |
| GET | /api/rooms/:roomId | Yes | Get single room |
| POST | /api/rooms/:roomId/join | Yes | Join room |
| POST | /api/rooms/:roomId/end | Yes | End room |
| POST | /api/rooms/:roomId/invite | Yes | Invite user (host only) |
| POST | /api/code/execute | Yes | Execute code (8 languages) |
| GET | /api/replay/:roomId | Yes | Get replay data |
| GET | /api/dashboard/stats | Yes | Dashboard statistics |
| POST | /api/chat | No | AI chat assistant |

## Appendix B: Socket Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| join-room | Client → Server | Join collaboration room |
| sync-state | Server → Client | Send full Yjs state |
| yjs-update | Bidirectional | Document sync |
| awareness-update | Bidirectional | Whiteboard cursors |
| code-awareness | Bidirectional | Code editor cursors |
| user-joined | Server → Room | New user notification |
| user-left | Server → Room | User left notification |
| user-awareness-removed | Server → Room | Clean up cursors |
| chat-message | Bidirectional | Chat messages |
| typing | Bidirectional | Typing indicators |
| join-video-room | Client → Server | Join video call |
| offer | Bidirectional | WebRTC offer |
| answer | Bidirectional | WebRTC answer |
| ice-candidate | Bidirectional | ICE candidates |

## Appendix C: Complete File Structure

```
syncspace-team14/
├── README.md
├── package.json
│
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── public/
│   │   └── SyncSpace.png (logo)
│   │
│   └── src/
│       ├── main.jsx                        (Entry + AuthProvider)
│       ├── App.jsx                         (Routes + ProtectedRoute)
│       ├── index.css                       (Tailwind + theme)
│       │
│       ├── components/
│       │   ├── AuthContext.jsx             (Auth state provider)
│       │   ├── ProtectedRoute.jsx          (Route guard)
│       │   ├── Navbar.jsx                  (Public nav, auth-aware)
│       │   ├── DNavbar.jsx                 (Dashboard nav)
│       │   ├── Login.jsx                   (Login form)
│       │   ├── Hero.jsx                    (Landing hero)
│       │   ├── Home.jsx                    (Home wrapper)
│       │   ├── About.jsx                   (About section)
│       │   ├── Features.jsx                (Features section)
│       │   ├── Footer.jsx                  (Site footer)
│       │   ├── FormInput.jsx               (Reusable input)
│       │   ├── WelcomeCard.jsx             (Dashboard welcome)
│       │   ├── ActionCard.jsx              (Create/Join room)
│       │   ├── RecentRooms.jsx             (Room list)
│       │   ├── StatsCard.jsx               (Stats display)
│       │   ├── JoinRoom.jsx                (Join room form)
│       │   ├── ChatPanel.jsx               (Real-time chat)
│       │   ├── AIAssistant.jsx             (AI chatbot)
│       │   └── VideoCall/
│       │       ├── VideoPanel.jsx          (Video container)
│       │       ├── VideoGrid.jsx           (Tile layout)
│       │       ├── VideoTile.jsx           (Individual tile)
│       │       └── VideoControls.jsx       (Mic/Camera/End)
│       │
│       ├── pages/
│       │   ├── Home.jsx                    (Home route)
│       │   ├── Dashboard.jsx               (Dashboard layout)
│       │   ├── CreateRoom.jsx              (Create room form)
│       │   ├── Register.jsx                (Registration)
│       │   ├── ForgotPassword.jsx          (Password reset)
│       │   ├── Rooms.jsx                   (All rooms)
│       │   └── workspace/
│       │       ├── WorkSpace.jsx           (Main layout)
│       │       ├── WorkSpaceHeader.jsx     (Header + buttons)
│       │       ├── Whiteboard.jsx          (Konva canvas)
│       │       ├── CodeEditor.jsx          (Monaco editor)
│       │       ├── Replay.jsx              (Session playback)
│       │       ├── InvitePopover.jsx       (Share link)
│       │       ├── FileExplorer.jsx        (File tree)
│       │       ├── EditorTabs.jsx          (Multi-file tabs)
│       │       └── Terminal.jsx            (VS Code terminal)
│       │
│       ├── hooks/
│       │   ├── useSync.js                  (Socket + Yjs + Awareness)
│       │   ├── useWebContainer.js          (WebContainer lifecycle)
│       │   ├── useCodeExecution.js         (Execution routing)
│       │   ├── useVideoCall.js             (WebRTC hook)
│       │   ├── useWebRTC.js                (Placeholder)
│       │   └── codeEditorConfig.js         (Constants)
│       │
│       ├── services/
│       │   ├── authService.js              (Auth API calls)
│       │   ├── socket.js                   (Socket instance)
│       │   └── videoService.js             (Video helpers)
│       │
│       ├── utils/
│       │   └── validation.js              (Form validation)
│       │
│       ├── data/
│       │   └── rooms.js                   (Placeholder data)
│       │
│       └── styles/                        (CSS files)
│
├── server/
│   ├── package.json
│   └── src/
│       ├── app.js                          (Express + routes)
│       ├── server.js                       (HTTP + Socket.io + DB)
│       ├── config/
│       │   └── db.js                       (MongoDB connection)
│       ├── controllers/
│       │   ├── authController.js           (Register, Login, Reset)
│       │   ├── room.controller.js          (Room CRUD + Invite)
│       │   ├── code.controller.js          (Code execution)
│       │   ├── replay.controller.js        (Replay data)
│       │   ├── dashboard.controller.js     (Stats)
│       │   └── chatController.js           (AI chat)
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── room.routes.js
│       │   ├── code.routes.js
│       │   ├── replay.routes.js
│       │   ├── dashboard.routes.js
│       │   └── chatRoutes.js
│       ├── middleware/
│       │   └── auth.middleware.js          (JWT protect)
│       ├── models/
│       │   ├── User.js
│       │   ├── Room.js
│       │   ├── YjsDocument.js
│       │   └── YjsUpdateLog.js
│       ├── socket/
│       │   ├── roomHandler.js              (Yjs sync + lifecycle)
│       │   └── videoHandler.js             (WebRTC signaling)
│       ├── utils/
│       │   └── generateRoomId.js
│       ├── validations/
│       │   └── room.validation.js
│       └── data/
│           ├── rooms.js                    (Legacy in-memory)
│           └── chatData.js                 (AI Q&A dataset)
│
└── docs/
    └── PROJECT_DOCUMENT.md                (This document)
```
