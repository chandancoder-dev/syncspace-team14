import * as Y from "yjs";
import { randomUUID } from "node:crypto";
import YjsDocument from "../models/YjsDocument.js";
import YjsUpdateLog from "../models/YjsUpdateLog.js";
import Room from "../models/Room.js";

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
    console.error(
      `[Yjs Persistence] Failed to load state for room ${roomId}:`,
      error.message,
    );
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
      { upsert: true, returnDocument: "after" },
    );
  } catch (error) {
    console.error(
      `[Yjs Persistence] Failed to save state for room ${roomId}:`,
      error.message,
    );
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

    // Access Control: JWT is already verified by ProtectedRoute on the frontend.
    // The Room ID acts as the invitation — only people who receive the link can join.
    // Auto-add joining user as a participant if not already in the list.
    if (user?.id) {
      Room.findOne({ roomId })
        .then((dbRoom) => {
          if (dbRoom) {
            const alreadyParticipant = dbRoom.participants.some(
              (p) => p.userId?.toString() === user.id,
            );
            if (!alreadyParticipant) {
              dbRoom.participants.push({
                userId: user.id,
                name: user.name || "Guest",
                joinedAt: new Date(),
              });
              dbRoom.save().catch(() => {});
            }
          }
        })
        .catch(() => {});
    }

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

    console.log(
      `[Room: ${roomId}] ${user?.name || "Anonymous"} connected (${room.users.size} online)`,
    );

    // Mark room as active in MongoDB when someone joins
    Room.findOneAndUpdate({ roomId }, { status: "active" }).catch(() => {}); // silent — room might not exist in DB yet (joined via link)

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

    // Log update for replay feature (async, non-blocking)
    const userData = room.users.get(socket.id);
    YjsUpdateLog.create({
      roomId,
      update: Buffer.from(uint8Update),
      userId: userData?.user?.id || null,
      userName: userData?.user?.name || "Anonymous",
      timestamp: new Date(),
    }).catch(() => {}); // silent — don't block real-time sync
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
  socket.on("send-message", ({ roomId, message, sender } = {}) => {
    const trimmedRoomId = typeof roomId === "string" ? roomId.trim() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!trimmedRoomId || !trimmedMessage || !socket.rooms.has(trimmedRoomId)) {
      return;
    }

    const senderId = rooms.get(trimmedRoomId)?.users.get(socket.id)?.user?.id || socket.id;

    io.to(trimmedRoomId).emit("receive-message", {
      id: randomUUID(),
      senderId,
      sender:
        typeof sender === "string" && sender.trim()
          ? sender.trim()
          : "Anonymous",
      message: trimmedMessage,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("code-awareness", ({ roomId, update }) => {
    if (!roomId) return;
    socket.to(roomId).emit("code-awareness", { update });
  });

  socket.on("disconnecting", () => {
    const joinedRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

    joinedRooms.forEach(async (roomId) => {
      if (!rooms.has(roomId)) return;

      const room = rooms.get(roomId);
      const userData = room.users.get(socket.id);
      const userName = userData?.user?.name || "Anonymous";
      const userId = userData?.user?.id;

      room.users.delete(socket.id);

      console.log(
        `[Room: ${roomId}] ${userName} disconnected (${room.users.size} online)`,
      );

      socket.to(roomId).emit("user-left", { socketId: socket.id });

      // Broadcast awareness removal so code editor cursors disappear immediately
      socket.to(roomId).emit("user-awareness-removed", { socketId: socket.id });

      // Check if the leaving user is the host
      if (userId) {
        try {
          const dbRoom = await Room.findOne({ roomId });
          if (dbRoom && dbRoom.createdBy?.toString() === userId) {
            // Host left — mark room as ended (for dashboard History)
            // But don't kick others — they can keep working
            dbRoom.status = "ended";
            dbRoom.endedAt = new Date();
            await dbRoom.save();
            console.log(
              `[Room: ${roomId}] Host left — session marked as ended`,
            );
          }
        } catch {}
      }

      // When the last user leaves, save state and clean up memory
      if (room.users.size === 0) {
        if (saveTimers.has(roomId)) {
          clearTimeout(saveTimers.get(roomId));
          saveTimers.delete(roomId);
        }

        saveState(roomId, room.ydoc);

        // Mark as ended if not already
        Room.findOneAndUpdate(
          { roomId, status: "active" },
          { status: "ended", endedAt: new Date() },
        ).catch(() => {});

        room.ydoc.destroy();
        rooms.delete(roomId);
      }
    });
  });
};

export default roomHandler;
