import Room from "../models/Room.js";
import generateRoomId from "../utils/generateRoomId.js";
import validateRoom from "../validations/room.validation.js";

// Create Room
export const createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate input
    const validationError = validateRoom(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const roomId = generateRoomId();

    const room = await Room.create({
      roomId,
      name,
      description,
      status: "active",
      createdBy: req.user.id,
      participants: [
        {
          userId: req.user.id,
          name: req.body.userName || "Host",
          joinedAt: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
};

// Get All Rooms (for the logged-in user)
export const getAllRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get rooms where user is the creator or a participant
    const rooms = await Room.find({
      $or: [
        { createdBy: userId },
        { "participants.userId": userId },
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

// Get Single Room
export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

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
export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Add participant if not already in the list
    const alreadyJoined = room.participants.some(
      (p) => p.userId?.toString() === userId
    );

    if (!alreadyJoined) {
      room.participants.push({
        userId,
        name: req.body.userName || "Guest",
        joinedAt: new Date(),
      });
      await room.save();
    }

    // If room was ended, reactivate it
    if (room.status === "ended") {
      room.status = "active";
      await room.save();
    }

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

// End Room (called when host leaves)
export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    room.status = "ended";
    room.endedAt = new Date();
    await room.save();

    res.status(200).json({
      success: true,
      message: "Room ended",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to end room",
    });
  }
};

// Invite user to room (only host can invite)
export const inviteToRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, userName } = req.body;
    const hostId = req.user.id;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Only the creator can invite
    if (room.createdBy.toString() !== hostId) {
      return res.status(403).json({
        success: false,
        message: "Only the room creator can invite users",
      });
    }

    // Check if already a participant
    const alreadyInvited = room.participants.some(
      (p) => p.userId?.toString() === userId
    );

    if (alreadyInvited) {
      return res.status(400).json({
        success: false,
        message: "User is already invited to this room",
      });
    }

    room.participants.push({
      userId,
      name: userName || "Guest",
      joinedAt: new Date(),
    });
    await room.save();

    res.status(200).json({
      success: true,
      message: "User invited successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to invite user",
    });
  }
};
