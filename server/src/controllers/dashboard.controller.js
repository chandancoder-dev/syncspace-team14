import rooms from "../data/rooms.js";

// Get Dashboard Statistics
export const getDashboardStats = (req, res) => {
  try {
    const activeRooms = rooms.size;

    res.status(200).json({
      success: true,
      stats: {
        activeRooms,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};