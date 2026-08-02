import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FaUsers, FaArrowRight, FaClock } from "react-icons/fa";

export default function RecentRooms() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH RECENT ROOMS
  // ==========================================

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
          },
        );

        setRooms(response.data.rooms || []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");

          return;
        }

        setError("Failed to load recent rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [navigate]);

  // ==========================================
  // DATE FORMATTER
  // ==========================================

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return {
        day: "Date unavailable",
        time: "--",
      };
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return {
        day: "Date unavailable",
        time: "--",
      };
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

    return {
      day,
      time,
    };
  };

  // ==========================================
  // GET ROOM DATE
  // ==========================================

  const getRoomDate = (room) => {
    return (
      room.updatedAt || room.lastAccessedAt || room.createdAt || room.created_at
    );
  };

  // ==========================================
  // OPEN WORKSPACE
  // ==========================================

  const openRoom = (roomId) => {
    navigate(`/workspace/${roomId}`);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1E3A8A]">Recent Rooms</h2>

          <p className="text-[#64748B] mt-2">Loading your recent rooms...</p>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1E3A8A]">Recent Rooms</h2>

          <p className="text-red-500 mt-2">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#1E3A8A]">Recent Rooms</h2>

          <p className="text-[#64748B] mt-2">
            Continue collaborating where you left off.
          </p>
        </div>

        {/* VIEW ALL */}

        <button
          type="button"
          onClick={() => navigate("/rooms")}
          className="
            inline-flex
            items-center
            justify-center
            bg-[#DBEAFE]
            text-primaryHover
            text-sm
            font-semibold
            px-4
            py-2
            rounded-lg
            hover:bg-[#BFDBFE]
            transition-colors
            duration-200
            whitespace-nowrap
          "
        >
          View All
        </button>
      </div>

      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {rooms.length === 0 ? (
        <div
          className="
            bg-white
            rounded-3xl
            border
            border-[#BFDBFE]
            p-8
            text-center
            shadow-sm
          "
        >
          <h3 className="text-xl font-semibold text-[#1E3A8A]">
            No Recent Rooms
          </h3>

          <p className="mt-2 text-[#64748B]">
            Create or join a collaboration room to get started.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.slice(0, 3).map((room) => {
            const dateTime = formatDateTime(getRoomDate(room));

            const memberCount = room.participants?.length || 0;

            // If you already have a real-time field
            // from your backend, use it here.

            return (
              <div
                key={room.roomId}
                className="
                  group
                  h-full
                  bg-white
                  rounded-3xl
                  border
                  border-[#BFDBFE]
                  p-6
                  shadow-sm
                  hover:border-[#60A5FA]
                  hover:-translate-y-1
                  hover:shadow-xl
                  hover:shadow-blue-100/70
                  transition-all
                  duration-300
                  flex
                  flex-col
                "
              >
                {/* ==========================================
                    ROOM NAME
                ========================================== */}

                <div className="flex-1">
                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-[#1E3A8A]
                      truncate
                    "
                    title={room.name}
                  >
                    {room.name}
                  </h3>

                  {/* ==========================================
                      CONNECTED USERS
                  ========================================== */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-3
                      text-sm
                      text-[#64748B]
                    "
                  >
                    <FaUsers className="text-primary" />

                    <span>
                      {memberCount} {memberCount === 1 ? "Member" : "Members"}{" "}
                      Connected
                    </span>
                  </div>

                  {/* ==========================================
                      DATE & TIME
                  ========================================== */}

                  <div
                    className="
                      mt-5
                      rounded-xl
                      bg-[#F8FAFC]
                      border
                      border-[#E2E8F0]
                      p-4
                    "
                  >
                    <div className="flex items-center gap-3">
                      <FaClock className="text-primary" />

                      <div>
                        <p className="text-sm font-semibold text-border">
                          {dateTime.day}
                        </p>

                        <p className="text-xs text-[#64748B] mt-1">
                          {dateTime.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==========================================
                    OPEN WORKSPACE
                ========================================== */}

                <button
                  type="button"
                  onClick={() => openRoom(room.roomId)}
                  className="
                    mt-7
                    w-full
                    bg-primary
                    hover:bg-primaryHover
                    rounded-xl
                    py-3
                    px-4
                    text-white
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-3
                    shadow-sm
                    hover:shadow-lg
                    hover:shadow-blue-200
                    transition-all
                    duration-300
                  "
                >
                  <span>Open Workspace</span>

                  <FaArrowRight
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/replay/${room.roomId}`)}
                  className="
                    mt-3
                    w-full
                    bg-transparent
                    border-2
                    border-blue-200
                    hover:border-primary
                    hover:bg-[#EFF6FF]
                    rounded-xl
                    py-3
                    px-4
                    text-[#475569]
                    hover:text-primary
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-3
                    transition-all
                    duration-300
                  "
                >
                  <span>▶ View Replay</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
