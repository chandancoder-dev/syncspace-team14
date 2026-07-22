import { useEffect, useState } from "react";
import axios from "axios";

import { FaUsers } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { IoFlash } from "react-icons/io5";

export default function WelcomeCard() {

  // Store active rooms count from backend
  const [activeRooms, setActiveRooms] = useState(0);

  // Fetch dashboard statistics
  useEffect(() => {

    const fetchDashboardStats = async () => {

      try {

        const response = await axios.get(
          "http://localhost:5000/api/dashboard/stats"
        );

        setActiveRooms(response.data.stats.activeRooms);

      } catch (error) {

        console.error(
          "Failed to fetch dashboard statistics:",
          error
        );

      }

    };

    fetchDashboardStats();

  }, []);


  const stats = [
    {
      title: "Online Users",
      value: "8",
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
      value: "23",
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
      "
    >

      <div className="grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT SECTION */}
        <div>

          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            SyncSpace Workspace
          </p>

          <h1 className="text-4xl lg:text-5xl font-bold text-[#1E3A8A]">
            Welcome Back 👋
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#475569] max-w-xl">
            Build, draw, code and collaborate with your teammates in
            real-time using SyncSpace. Create a room or join your
            existing workspace instantly.
          </p>

        </div>


        {/* RIGHT SECTION - STATS */}
        <div className="grid grid-cols-3 gap-4">

          {stats.map((item) => (

            <div
              key={item.title}
              className="
                bg-white/80
                backdrop-blur-sm
                rounded-2xl
                border
                border-[#BFDBFE]
                p-5
                text-center
                shadow-sm
                hover:shadow-md
                hover:-translate-y-1
                transition-all
                duration-300
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
                `}
              >
                {item.icon}
              </div>

              {/* Value */}
              <h2 className="text-3xl font-bold text-[#1E293B]">
                {item.value}
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