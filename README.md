# 🚀 SyncSpace - Real-Time Collaborative Whiteboard & Code Editor

> A real-time collaborative workspace where multiple users can simultaneously draw diagrams and write code with conflict-free synchronization.

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Socket.io](https://img.shields.io/badge/Socket.io-RealTime-black)
![Yjs](https://img.shields.io/badge/CRDT-Yjs-orange)
![Monaco](https://img.shields.io/badge/Monaco-Editor-purple)

---

## 📌 Project Overview

**SyncSpace** is a real-time collaborative whiteboard and code editor designed for distributed engineering teams, technical interviews, online classrooms, pair programming, and collaborative software development.

Unlike traditional request-response web applications, SyncSpace enables multiple users to edit code and draw simultaneously using **WebSockets** and **Conflict-free Replicated Data Types (CRDTs)**, ensuring low-latency and conflict-free collaboration.

---

## 🌐 Domain

**Developer Tools & Real-Time Collaboration**

---

## 🎯 Problem Statement

Building applications where multiple users simultaneously edit shared documents or drawings requires advanced synchronization algorithms beyond traditional MERN applications.

SyncSpace addresses this challenge using:

- Socket.io (Real-Time Communication)
- Yjs (Conflict-free Replicated Data Types)
- Monaco Editor (VS Code engine)
- Konva.js (Canvas rendering)

---

## 💡 Use Case

A distributed engineering team conducts a technical interview:

- Candidate A draws a system architecture on the whiteboard.
- Interviewer B writes Node.js code in the editor.
- Both users view updates instantly in real-time.
- Concurrent edits are automatically merged using Yjs without conflicts.
- Code can be executed directly from the editor with output visible to all.

---

## ✨ Features

### 🖊 Whiteboard
- Freehand drawing (pencil tool)
- Shapes: Rectangle, Circle, Line, Arrow
- Text tool
- Eraser
- Select, move, and transform shapes
- Undo / Redo (Ctrl+Z / Ctrl+Y)
- Zoom & Pan (scroll wheel)
- Responsive floating toolbar (collapses to sidebar on narrow screens)
- Remote cursors with user names

### 💻 Code Editor
- Monaco Editor (VS Code engine)
- Real-time collaborative editing via y-monaco + Yjs
- Language selector: JavaScript, Python, Java, C, C++
- Code execution with Run button (own backend)
- Output panel with stdout/stderr and exit code
- Remote cursors with colored indicators and name labels
- Custom light theme matching design system
- Auto-closing brackets, format on paste, IntelliSense

### 🌐 Collaboration
- Room-based sessions with unique Room IDs
- Share room link (copy URL or Room ID)
- Live cursor tracking (whiteboard + code editor)
- User presence indicators with avatars
- Instant synchronization across all connected clients
- Language switching synced to all participants

### 💾 Persistence
- Yjs document state saved to MongoDB
- Debounced auto-save (2 seconds after last edit)
- Sessions survive server restarts
- State restored when users rejoin a room

### 🔐 Security & Auth
- JWT authentication (register, login)
- Protected routes with `?next=` redirect for shared links
- Login/Register redirect if already authenticated
- Auth-protected code execution endpoint
- Logout with token cleanup

### 🖥 Code Execution
- Built-in backend execution engine
- Supports: JavaScript (Node), Python, Java, C, C++
- 5-second timeout (prevents infinite loops)
- Temp file isolation per execution
- 1MB output limit
- Compilation error handling (C/C++/Java)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| React Router | Routing + protected routes |
| Konva.js | Canvas whiteboard rendering |
| Monaco Editor | Code editor (VS Code engine) |
| Yjs | CRDT for conflict-free sync |
| y-monaco | Monaco ↔ Yjs binding |
| y-protocols | Awareness protocol (remote cursors) |
| Socket.io Client | Real-time WebSocket communication |
| Tailwind CSS | Styling (utilities) |
| React Icons (Feather) | Icon system |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| Socket.io | WebSocket server for real-time sync |
| MongoDB + Mongoose | Database (users, rooms, Yjs state) |
| Yjs (server-side) | Document state management |
| JWT (jsonwebtoken) | Authentication tokens |
| bcrypt | Password hashing |
| child_process | Code execution engine |

---

## 📁 Project Structure

```
syncspace-team14/
├── client/
│   └── src/
│       ├── components/        # Shared UI components
│       ├── pages/             # Route pages
│       │   └── workspace/     # Whiteboard + CodeEditor + WorkSpace
│       ├── hooks/             # useSync (Socket + Yjs)
│       ├── services/          # API calls
│       ├── styles/            # CSS files
│       └── utils/             # Validation helpers
│
├── server/
│   └── src/
│       ├── controllers/       # Auth, Room, Dashboard, Code execution
│       ├── routes/            # API route definitions
│       ├── middleware/        # JWT auth middleware
│       ├── models/            # User, YjsDocument (MongoDB)
│       ├── socket/            # roomHandler (Yjs sync + awareness)
│       ├── config/            # Database connection
│       └── utils/             # Room ID generator
│
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Python 3, GCC, G++, Java (for code execution)

### Clone Repository

```bash
git clone https://github.com/chandancoder-dev/syncspace-team14.git
cd syncspace-team14
```

### Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=8000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

Start server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_SERVER_URL=http://localhost:8000
```

Start client:
```bash
npm run dev
```

---

## 🔄 How Real-Time Sync Works

```
User A types/draws
       │
       ▼
Local Yjs Doc updates → useSync sends via Socket.io
       │
       ▼
Server receives → applies to server Yjs Doc → broadcasts to room
       │
       ▼
User B receives → applies to local Yjs Doc → UI updates instantly
       │
       ▼
Server debounce-saves Yjs state to MongoDB (persistence)
```

Key: Updates are marked with `'remote'` origin to prevent echo loops.

---

## 🌿 Git Workflow

- Feature branches: `feature/username`
- Meaningful commit messages: `feat:`, `fix:`, `merge:`
- Pull Requests before merging to `main`
- `main` branch stays stable

---

## 👥 Team

**Project:** SyncSpace  
**Domain:** Developer Tools & Real-Time Collaboration  

Developed as part of the Internship Program.

---

## 📄 License

This project is developed for educational purposes as part of the internship program.
