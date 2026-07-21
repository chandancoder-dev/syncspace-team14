# 🚀 SyncSpace - Real-Time Collaborative Whiteboard & Code Editor

> A real-time collaborative workspace where multiple users can simultaneously draw diagrams and write code with conflict-free synchronization.

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Socket.io](https://img.shields.io/badge/Socket.io-RealTime-black)
![Yjs](https://img.shields.io/badge/CRDT-Yjs-orange)

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
- Monaco Editor
- Konva.js

---

## 💡 Use Case

A distributed engineering team conducts a technical interview.

- Candidate A draws a system architecture.
- Interviewer B writes Node.js code.
- Both users view updates instantly.
- Concurrent edits are automatically merged using Yjs without conflicts.

---

## 🏗 Key Modules

### 🔄 Real-Time Sync Engine
- Express.js
- Socket.io
- Room Management
- WebSocket Communication

### 🧠 CRDT Engine
- Yjs
- Shared Document Synchronization
- Cursor Awareness
- Conflict Resolution

### 🖊 Interactive Whiteboard
- React
- Konva.js
- Drawing Tools
- Shape Rendering

### 💻 Collaborative Code Editor
- Monaco Editor
- Shared Text Model
- Real-Time Code Synchronization

---

## ✨ Features

### 🖊 Whiteboard
- Freehand Drawing
- Shapes (Rectangle, Circle, Line)
- Text Tool
- Eraser
- Undo / Redo
- Zoom & Pan

### 💻 Code Editor
- Monaco Editor
- Multi-user Editing
- Syntax Highlighting
- Shared Cursor
- Shared Selection
- Auto Save

### 🌐 Collaboration
- Room-based Collaboration
- Live Cursor Tracking
- User Presence
- Instant Synchronization

### 🔐 Security
- JWT Authentication
- Protected Routes
- Workspace Access Control


---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- React Router
- Konva.js
- Monaco Editor
- Yjs
- Socket.io Client

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB
- Mongoose
- JWT
- Yjs

---


## 📁 Project Structure

```text
syncspace-team14/
├── client/
├── server/
├── docs/
├── .github/
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/chandancoder-dev/syncspace-team14.git
cd syncspace-team14
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

## 🌿 Git Workflow

- Create a feature branch for each task.
- Commit changes with meaningful commit messages.
- Open a Pull Request before merging.
- Keep `main` stable.

---

## 👥 Team

**Project:** SyncSpace

**Domain:** Developer Tools & Real-Time Collaboration

Developed as part of the Internship Program.

---

## 📄 License

This project is developed for educational purposes as part of the internship program.