# 🚀 SyncSpace - Real-Time Collaborative Whiteboard & Code Editor

> A real-time collaborative workspace where multiple users can simultaneously draw diagrams and write code with conflict-free synchronization.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Socket.io](https://img.shields.io/badge/Socket.io-RealTime-black)
![Yjs](https://img.shields.io/badge/CRDT-Yjs-orange)

---

# 📌 Project Overview

**SyncSpace** is a real-time collaborative whiteboard and code editor designed for distributed engineering teams, technical interviews, online classrooms, and pair programming.

Unlike traditional web applications that rely on the request-response model, SyncSpace enables multiple users to simultaneously edit code and draw on a shared canvas using **WebSockets** and **Conflict-free Replicated Data Types (CRDTs)**.

The application ensures seamless collaboration with minimal latency while preventing conflicts during concurrent edits.

---

# 🎯 Problem Statement

Standard web applications operate on a request/response model.

Building a system where multiple users can simultaneously draw on a shared whiteboard or edit code without race conditions, lag, or overwriting each other's work requires advanced synchronization techniques.

SyncSpace solves this problem using:

- WebSockets (Socket.io)
- Conflict-free Replicated Data Types (Yjs)
- Monaco Editor
- Konva.js Canvas

---

# 💡 Use Case

A distributed engineering team is conducting a technical interview.

- Candidate A draws a system architecture on the whiteboard.
- Interviewer B writes Node.js code simultaneously.
- Both users see each other's changes instantly.
- If both edit the same line at the same time, Yjs merges the changes without conflicts.

---

# ✨ Features

## 🖊 Real-Time Whiteboard

- Freehand Drawing
- Rectangle Tool
- Circle Tool
- Line Tool
- Text Tool
- Eraser
- Undo / Redo
- Zoom & Pan

---

## 💻 Collaborative Code Editor

- Monaco Editor (VS Code)
- Multi-user Editing
- Syntax Highlighting
- Auto Save
- Shared Cursor
- Shared Selection

---

## 🌐 Real-Time Collaboration

- Live Cursor Tracking
- User Presence
- Room-based Collaboration
- Instant Synchronization
- WebSocket Communication

---

## 🔐 Authentication

- JWT Authentication
- Protected Routes
- Workspace Access Control

---

## 💾 Persistence

- MongoDB
- Session Recovery
- Automatic Document Saving

---

## 📂 Assets

- Upload Files
- Download Files
- Shared Workspace

---

## ⏪ Replay

- Timeline Replay
- Session History
- Drawing Playback

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Konva.js
- Monaco Editor
- Yjs
- Zustand
- Socket.io Client

## Backend

- Node.js
- Express.js
- Socket.io
- MongoDB
- Mongoose
- JWT
- Yjs

---

# 📁 Project Structure

```text
syncspace-team14/

├── client/
│
├── server/
│
├── docs/
│
├── .github/
│
├── README.md
├── .gitignore
└── docker-compose.yml
```

---

# 📂 Frontend Structure

```text
client/

src/

├── assets/

├── components/
│   ├── common/
│   ├── sidebar/
│   ├── navbar/
│   ├── toolbar/
│   ├── whiteboard/
│   ├── editor/
│   └── assets/

├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Workspace/
│   ├── Whiteboard/
│   ├── CodeEditor/
│   ├── Team/
│   └── Settings/

├── layouts/

├── routes/

├── context/

├── hooks/

├── services/

├── utils/

├── styles/

├── App.jsx

└── main.jsx
```

---

# 📂 Backend Structure

```text
server/

src/

├── config/

├── controllers/

├── middleware/

├── models/

├── routes/

├── sockets/

├── yjs/

├── services/

├── utils/

├── app.js

└── server.js
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/chandancoder-dev/syncspace-team14.git

cd syncspace-team14
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

## Backend

```bash
cd server

npm install

npm run dev
```

---

# 👥 Team

Project developed as part of the Internship Program.

**Project:** SyncSpace

**Domain:** Developer Tools & Real-Time Collaboration

---

# 📄 License

This project is developed for educational purposes during the internship program.# SyncSpace
