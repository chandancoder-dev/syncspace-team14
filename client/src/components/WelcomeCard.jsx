import { useEffect, useState } from "react";
import axios from "axios";

import { FaUsers } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { IoFlash } from "react-icons/io5";

export default function WelcomeCard() {

  // =============================
  // USERNAME
  // =============================

  const getUserName = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return "User";
    }

    try {
      const user = JSON.parse(storedUser);

      return (
        user.name ||
        user.username ||
        user.fullName ||
        user.email?.split("@")[0] ||
        "User"
      );
    } catch (error) {
      console.error("Failed to read logged-in user:", error);
      return "User";
    }
  };

  const userName = getUserName();


  // =============================
  // DASHBOARD STATS
  // =============================

  const [activeRooms, setActiveRooms] = useState(0);

  const [onlineUsers, setOnlineUsers] = useState(0);

  const [todaysSessions, setTodaysSessions] = useState(0);

  const [loading, setLoading] = useState(true);


  // =============================
  // FETCH DASHBOARD STATISTICS
  // =============================

  useEffect(() => {

    const fetchDashboardStats = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL || "http://localhost:8000"}/api/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const stats = response.data.stats || {};

        // Active rooms from backend
        setActiveRooms(stats.activeRooms || 0);

        // Online users from backend
        setOnlineUsers(stats.onlineUsers || 0);

        // Today's sessions from backend
        setTodaysSessions(stats.todaysSessions || 0);

      } catch (error) {

        console.error(
          "Failed to fetch dashboard statistics:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchDashboardStats();

  }, []);


  // =============================
  // STATS
  // =============================

  const stats = [
    {
      title: "Online Users",
      value: onlineUsers,
      icon: <FaUsers />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Active Rooms",
      value: activeRooms,
      icon: <MdMeetingRoom />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Today's Sessions",
      value: todaysSessions,
      icon: <IoFlash />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];


  return (
    <section
      className="
        rounded-3xl
        bg-linear-to-r
        from-[#DCEBFF]
        via-[#E5F0FF]
        to-[#EEF6FF]
        border
        border-[#BFDBFE]
        p-8
        lg:p-10
        shadow-sm
        transition-all
        duration-300
        hover:border-[#93C5FD]
        hover:shadow-lg
        hover:shadow-blue-100/60
      "
    >

      <div className="grid lg:grid-cols-2 gap-10 items-center">

        {/* ============================= */}
        {/* LEFT SECTION */}
        {/* ============================= */}

        <div>

          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            SyncSpace Workspace
          </p>

          <h1 className="text-4xl lg:text-5xl font-bold text-[#1E3A8A]">
            Welcome, {userName}
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#475569] max-w-xl">
            Build, draw, code and collaborate with your teammates in
            real-time using SyncSpace. Create a room or join your
            existing workspace instantly.
          </p>

        </div>


        {/* ============================= */}
        {/* RIGHT SECTION */}
        {/* ============================= */}

        <div className="grid grid-cols-3 gap-4">

          {stats.map((item) => (

            <div
              key={item.title}
              className="
                group
                bg-white/80
                backdrop-blur-sm
                rounded-2xl
                border
                border-[#BFDBFE]
                p-5
                text-center
                shadow-sm
                hover:shadow-lg
                hover:shadow-blue-200/50
                hover:-translate-y-2
                hover:border-[#60A5FA]
                transition-all
                duration-300
                cursor-default
              "
            >

              {/* Icon */}

              <div
                className={`
                  ${item.bg}
                  ${item.color}
                  w-12
                  h-12
                  mx-auto
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  text-2xl
                  mb-3
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:rotate-3
                `}
              >
                {item.icon}
              </div>


              {/* Value */}

              <h2
                className="
                  text-3xl
                  font-bold
                  text-[#1E293B]
                  transition-colors
                  duration-300
                  group-hover:text-[#2563EB]
                "
              >

                {loading ? (
                  <span className="animate-pulse">
                    ...
                  </span>
                ) : (
                  item.value
                )}

              </h2>


              {/* Title */}

              <p className="text-xs sm:text-sm text-[#64748B] mt-2">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}