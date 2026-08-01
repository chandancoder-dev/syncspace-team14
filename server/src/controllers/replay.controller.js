import YjsUpdateLog from "../models/YjsUpdateLog.js";
import Room from "../models/Room.js";

// Get replay data for a room (all Yjs updates in chronological order)
export const getReplayData = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Verify room exists
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Get all updates sorted by timestamp
    const updates = await YjsUpdateLog.find({ roomId })
      .sort({ timestamp: 1 })
      .select("update userName timestamp")
      .lean();

    // Convert Buffer to Array for transport
    const formattedUpdates = updates.map((u) => ({
      update: Array.from(new Uint8Array(u.update.buffer || u.update)),
      userName: u.userName,
      timestamp: u.timestamp,
    }));

    res.status(200).json({
      success: true,
      room: {
        roomId: room.roomId,
        name: room.name,
        createdAt: room.createdAt,
        endedAt: room.endedAt,
      },
      updates: formattedUpdates,
      totalUpdates: formattedUpdates.length,
    });
  } catch (error) {
    console.error("Replay data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch replay data",
    });
  }
};
