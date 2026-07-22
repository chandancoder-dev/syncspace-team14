import * as Y from "yjs";

// Store Yjs docs and connected users per room
const rooms = new Map(); 
const roomHandler = (io, socket) => {
  socket.on("join-room", ({ roomId, user }) => {
    if (!roomId) return;

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        ydoc: new Y.Doc(),
        users: new Map(),
      });
    }

    const room = rooms.get(roomId);
    socket.join(roomId);

    room.users.set(socket.id, { user, cursor: null });

    const state = Y.encodeStateAsUpdate(room.ydoc);
    socket.emit("sync-state", { update: Array.from(state) });

    const existingUsers = [];
    room.users.forEach((value, socketId) => {
      if (socketId !== socket.id) {
        existingUsers.push({ socketId, ...value });
      }
    });
    socket.emit("awareness-init", existingUsers);

    socket.to(roomId).emit("user-joined", { socketId: socket.id, user });
  });

  socket.on("yjs-update", ({ roomId, update }) => {
    if (!roomId || !rooms.has(roomId)) return;

    const room = rooms.get(roomId);
    const uint8Update = new Uint8Array(update);
    Y.applyUpdate(room.ydoc, uint8Update);

  
    socket.to(roomId).emit("yjs-update", { update });
  });

  socket.on("awareness-update", ({ roomId, state }) => {
    if (!roomId || !rooms.has(roomId)) return;

    const room = rooms.get(roomId);
  
    if (room.users.has(socket.id)) {
      room.users.get(socket.id).cursor = state.cursor;
    }


    socket.to(roomId).emit("awareness-update", { socketId: socket.id, state });
  });

  socket.on("disconnecting", () => {

    const joinedRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

    joinedRooms.forEach((roomId) => {
      if (!rooms.has(roomId)) return;

      const room = rooms.get(roomId);

      room.users.delete(socket.id);

      socket.to(roomId).emit("user-left", { socketId: socket.id });

      if (room.users.size === 0) {
        room.ydoc.destroy();
        rooms.delete(roomId);
      }
    });
  });
};

export default roomHandler;
