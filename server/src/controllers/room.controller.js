import rooms from "../data/rooms.js";
import generateRoomId from "../utils/generateRoomId.js";
import validateRoom from "../validations/room.validation.js";

// Create Room
export const createRoom = (req, res) => {
  try {
    const { name, description, language, visibility } = req.body;

    // Validate input
    const validationError = validateRoom(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const roomId = generateRoomId();

    const room = {
      roomId,
      name,
      description,
      language,
      visibility,
      participants: [],
      createdAt: new Date(),
    };

    rooms.set(roomId, room);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
};

// Get Room
export const getRoom = (req, res) => {
  try {
    const { roomId } = req.params;

    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch room",
    });
  }
};

// Join Room
export const joinRoom = (req, res) => {
  try {
    const { roomId } = req.params;
    const { username } = req.body;

    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    room.participants.push({
      username,
    });

    rooms.set(roomId, room);

    res.status(200).json({
      success: true,
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to join room",
    });
  }
};
