import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaArrowRight } from "react-icons/fa";

export default function Rooms() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL || "http://localhost:8000"}/api/rooms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRooms(response.data.rooms || []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-xl font-semibold">Loading Rooms...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 font-medium mb-6 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-[#1E3A8A]">
          All Rooms
        </h1>

        <p className="text-gray-600 mt-2 mb-8">
          {rooms.length} Room{rooms.length !== 1 && "s"} Available
        </p>

        {rooms.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow">
            <h2 className="text-xl font-semibold">No Rooms Found</h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const memberCount = room.participants?.length || 0;

              return (
                <div
                  key={room.roomId}
                  className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-[#1E3A8A]">
                    {room.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-4 text-gray-600">
                    <FaUsers className="text-blue-600" />
                    <span>{memberCount} Members</span>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/workspace/${room.roomId}`)
                    }
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex justify-center items-center gap-2"
                  >
                    Open Workspace
                    <FaArrowRight />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}