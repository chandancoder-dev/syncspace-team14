import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaArrowRight, FaClock } from "react-icons/fa";

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

  const getRoomDate = (room) => {
    return (
      room.updatedAt ||
      room.lastAccessedAt ||
      room.createdAt ||
      room.created_at
    );
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return { day: "Date unavailable", time: "--" };
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return { day: "Date unavailable", time: "--" };
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let day;
    if (isToday) {
      day = "Today";
    } else if (isYesterday) {
      day = "Yesterday";
    } else {
      day = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    return { day, time };
  };

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
              const dateTime = formatDateTime(getRoomDate(room));

              return (
                <div
                  key={room.roomId}
                  className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-[#1E3A8A]">
                    {room.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-4 text-gray-600">
                    <FaUsers className="text-blue-600" />
                    <span>{memberCount} Members</span>
                  </div>

                  <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center gap-3">
                    <div className="bg-blue-500 rounded-full p-2 flex items-center justify-center shrink-0">
                      <FaClock className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-blue-900">{dateTime.day}</p>
                      <p className="text-blue-600 text-sm">{dateTime.time}</p>
                    </div>
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