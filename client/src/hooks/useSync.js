import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { io } from 'socket.io-client';

// Server URL from .env file
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

// Pick a random color for this user
const randomColor = () => {
  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get the logged-in user's display name
const getUserName = () => {
  const directName = localStorage.getItem('syncspace_user');
  if (directName) return directName;

  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      return user.name || user.username || user.fullName || user.email?.split('@')[0] || 'Anonymous';
    } catch { /* ignore parse errors */ }
  }

  return 'Anonymous';
};

const useSync = (roomId) => {
  const ydocRef = useRef(new Y.Doc());
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);

 
  const [users, setUsers] = useState(new Map());

  const meRef = useRef({
    name: getUserName(),
    color: randomColor(),
  });

  useEffect(() => {
    if (!roomId) return;

    const ydoc = ydocRef.current;
    const me = meRef.current;

    const socket = io(SERVER_URL, { transports: ['websocket'] });
    socketRef.current = socket;


    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', { roomId, user: me });
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('sync-state', ({ update }) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });
    socket.on('yjs-update', ({ update }) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });

    const onLocalUpdate = (update, origin) => {
      if (origin === 'remote') return;
      socket.emit('yjs-update', { roomId, update: Array.from(update) });
    };
    ydoc.on('update', onLocalUpdate);

    socket.on('awareness-init', (states) => {
      setUsers((prev) => {
        const next = new Map(prev);
        states.forEach(({ socketId, ...state }) => next.set(socketId, state));
        return next;
      });
    });

    socket.on('awareness-update', ({ socketId, state }) => {
      setUsers((prev) => {
        const next = new Map(prev);
        next.set(socketId, state);
        return next;
      });
    });

    socket.on('user-joined', ({ socketId, user }) => {
      setUsers((prev) => {
        const next = new Map(prev);
        next.set(socketId, { user, cursor: null });
        return next;
      });
    });

    socket.on('user-left', ({ socketId }) => {
      setUsers((prev) => {
        const next = new Map(prev);
        next.delete(socketId);
        return next;
      });
    });


    return () => {
      ydoc.off('update', onLocalUpdate);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
      setUsers(new Map());
    };
  }, [roomId]);

  
  const emitCursor = (cursor) => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit('awareness-update', {
      roomId,
      state: { user: meRef.current, cursor },
    });
  };

  return {
    ydoc: ydocRef.current,
    socket: socketRef.current,
    connected,
    users,
    me: meRef.current,
    emitCursor,
  };
};

export default useSync;
