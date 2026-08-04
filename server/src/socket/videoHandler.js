const videoHandler = (io) => {
  io.on("connection", (socket) => {

    socket.on("join-video-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("offer", ({ offer, to }) => {
      io.to(to).emit("offer", {
        offer,
        from: socket.id,
      });
    });

    socket.on("answer", ({ answer, to }) => {
      io.to(to).emit("answer", {
        answer,
        from: socket.id,
      });
    });

    socket.on("ice-candidate", ({ candidate, to }) => {
      io.to(to).emit("ice-candidate", {
        candidate,
        from: socket.id,
      });
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("user-left", socket.id);
    });

  });
};

export default videoHandler;