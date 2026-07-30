import * as Y from "yjs";
import YjsDocument from "../models/YjsDocument.js";

// Store Yjs docs and connected users per room (in-memory)
const rooms = new Map();

// Debounce timers for saving per room
const saveTimers = new Map();

// Save interval in ms 
const SAVE_DEBOUNCE_MS = 2000;


async function loadState(roomId) {
  try {
    const doc = await YjsDocument.findOne({ roomId });
    if (doc && doc.state) {
      return new Uint8Array(doc.state);
    }
  } catch (error) {
    console.error(`[Yjs Persistence] Failed to load state for room ${roomId}:`, error.message);
  }
  return null;
}

/**
 * Save Yjs state to MongoDB for a given room.
 */
async function saveState(roomId, ydoc) {
  try {
    const state = Buffer.from(Y.encodeStateAsUpdate(ydoc));
    await YjsDocument.findOneAndUpdate(
      { roomId },
      { state },
      { upsert: true, returnDocument: 'after' }
    );
  } catch (error) {
    console.error(`[Yjs Persistence] Failed to save state for room ${roomId}:`, error.message);
  }
}

function scheduleSave(roomId, ydoc) {
  if (saveTimers.has(roomId)) {
    clearTimeout(saveTimers.get(roomId));
  }

  const timer = setTimeout(() => {
    saveState(roomId, ydoc);
    saveTimers.delete(roomId);
  }, SAVE_DEBOUNCE_MS);

  saveTimers.set(roomId, timer);
}

const roomHandler = (io, socket) => {
  socket.on("join-room", async ({ roomId, user }) => {
    if (!roomId) return;

    // Create room in memory if it doesn't exist
    if (!rooms.has(roomId)) {
      const ydoc = new Y.Doc();

      // Load persisted state from MongoDB
      const savedState = await loadState(roomId);
      if (savedState) {
        Y.applyUpdate(ydoc, savedState);
      }

      rooms.set(roomId, {
        ydoc,
        users: new Map(),
      });
    }

    const room = rooms.get(roomId);
    socket.join(roomId);

    room.users.set(socket.id, { user, cursor: null });

    console.log(`[Room: ${roomId}] ${user?.name || 'Anonymous'} connected (${room.users.size} online)`);

    // Send current Yjs state to the joining user
    const state = Y.encodeStateAsUpdate(room.ydoc);
    socket.emit("sync-state", { update: Array.from(state) });

    // Send list of existing users for awareness
    const existingUsers = [];
    room.users.forEach((value, socketId) => {
      if (socketId !== socket.id) {
        existingUsers.push({ socketId, ...value });
      }
    });
    socket.emit("awareness-init", existingUsers);

    // Notify others that a new user joined
    socket.to(roomId).emit("user-joined", { socketId: socket.id, user });
  });

  socket.on("yjs-update", ({ roomId, update }) => {
    if (!roomId || !rooms.has(roomId)) return;

    const room = rooms.get(roomId);
    const uint8Update = new Uint8Array(update);
    Y.applyUpdate(room.ydoc, uint8Update);

    // Broadcast to other users in the room
    socket.to(roomId).emit("yjs-update", { update });
    scheduleSave(roomId, room.ydoc);
  });

  socket.on("awareness-update", ({ roomId, state }) => {
    if (!roomId || !rooms.has(roomId)) return;

    const room = rooms.get(roomId);

    if (room.users.has(socket.id)) {
      room.users.get(socket.id).cursor = state.cursor;
    }

    socket.to(roomId).emit("awareness-update", { socketId: socket.id, state });
  });

  // Code editor awareness (y-protocols) — broadcast cursor positions
  socket.on("code-awareness", ({ roomId, update }) => {
    if (!roomId) return;
    socket.to(roomId).emit("code-awareness", { update });
  });

  socket.on("disconnecting", () => {
    const joinedRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

    joinedRooms.forEach((roomId) => {
      if (!rooms.has(roomId)) return;

      const room = rooms.get(roomId);
      const userData = room.users.get(socket.id);
      const userName = userData?.user?.name || 'Anonymous';

      room.users.delete(socket.id);

      console.log(`[Room: ${roomId}] ${userName} disconnected (${room.users.size} online)`);

      socket.to(roomId).emit("user-left", { socketId: socket.id });

      // When the last user leaves, save state and clean up memory
      if (room.users.size === 0) {
        if (saveTimers.has(roomId)) {
          clearTimeout(saveTimers.get(roomId));
          saveTimers.delete(roomId);
        }


        saveState(roomId, room.ydoc);

        room.ydoc.destroy();
        rooms.delete(roomId);
      }
    });
  });
};

export default roomHandler;
