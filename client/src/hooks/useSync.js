import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import * as awarenessProtocol from 'y-protocols/awareness';
import { io } from 'socket.io-client';

// Server URL from .env file
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

// Deterministic color for a user 
const CURSOR_COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];

const getUserColor = () => {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      const id = user.id || user.email || '';
      // Hash the user ID to pick a consistent color
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
    } catch {}
  }
  return CURSOR_COLORS[0];
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
  const awarenessRef = useRef(new Awareness(ydocRef.current));
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState(new Map());

  const meRef = useRef({
    name: getUserName(),
    color: getUserColor(),
  });

  useEffect(() => {
    if (!roomId) return;

    const ydoc = ydocRef.current;
    const awareness = awarenessRef.current;
    const me = meRef.current;

    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    socketRef.current = socket;

    // Set local awareness state (user info for remote cursor labels)
    awareness.setLocalStateField('user', {
      name: me.name,
      color: me.color,
    });

    socket.on('connect', () => {
      setConnected(true);
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : null;
      socket.emit('join-room', { roomId, user: { ...me, id: userId } });

      // After reconnect, push any local changes that happened while offline
      const localState = Y.encodeStateAsUpdate(ydoc);
      if (localState.length > 2) {
        // Only send if there's meaningful content (empty doc = 2 bytes)
        socket.emit('yjs-update', { roomId, update: Array.from(localState) });
      }
    });

    socket.on('disconnect', (reason) => {
      setConnected(false);
      if (import.meta.env.DEV) console.log(`[SyncSpace] Disconnected: ${reason}`);
    });

    socket.on('reconnect_attempt', (attempt) => {
      if (import.meta.env.DEV) console.log(`[SyncSpace] Reconnection attempt ${attempt}...`);
    });

    socket.on('reconnect_failed', () => {
      if (import.meta.env.DEV) console.log('[SyncSpace] Reconnection failed after all attempts');
    });

    // Yjs document sync
    socket.on('sync-state', ({ update }) => {
      Y.applyUpdate(ydoc, new Uint8Array(update), 'remote');
    });
    socket.on('yjs-update', ({ update }) => {
      Y.applyUpdate(ydoc, new Uint8Array(update), 'remote');
    });

    const onLocalUpdate = (update, origin) => {
      if (origin === 'remote') return;
      socket.emit('yjs-update', { roomId, update: Array.from(update) });
    };
    ydoc.on('update', onLocalUpdate);

    // === Code editor awareness (y-protocols) ===
    // When local awareness changes, send to server
    const onAwarenessChange = ({ added, updated, removed }, origin) => {
      if (origin === 'remote') return; // skip if triggered by incoming remote update
      const changedClients = added.concat(updated).concat(removed);
      const update = awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients);
      socket.emit('code-awareness', { roomId, update: Array.from(update) });
    };
    awareness.on('update', onAwarenessChange);

    // When server sends awareness update from other clients
    socket.on('code-awareness', ({ update }) => {
      awarenessProtocol.applyAwarenessUpdate(awareness, new Uint8Array(update), 'remote');
    });

    // === Whiteboard awareness (custom, existing) ===
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

    // When a user leaves, clean their awareness state (removes code editor cursor)
    socket.on('user-awareness-removed', () => {
      const remoteClients = [];
      awareness.getStates().forEach((_, clientID) => {
        if (clientID !== ydoc.clientID) {
          remoteClients.push(clientID);
        }
      });
      if (remoteClients.length > 0) {
        awarenessProtocol.removeAwarenessStates(awareness, remoteClients, 'remote');
      }
    });

    return () => {
      ydoc.off('update', onLocalUpdate);
      awareness.off('update', onAwarenessChange);
      awareness.setLocalState(null); // signal removal to peers
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
      setUsers(new Map());
    };
  }, [roomId]);

  // Whiteboard cursor emit (existing)
  const emitCursor = (cursor) => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit('awareness-update', {
      roomId,
      state: { user: meRef.current, cursor },
    });
  };

  return {
    ydoc: ydocRef.current,
    awareness: awarenessRef.current,
    socket: socketRef.current,
    connected,
    users,
    me: meRef.current,
    emitCursor,
  };
};

export default useSync;
