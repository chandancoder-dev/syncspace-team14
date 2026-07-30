import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaUsers,
  FaArrowRight,
  FaCircle,
} from "react-icons/fa";

export default function RecentRooms() {

  const navigate = useNavigate();


  // =============================
  // STATE
  // =============================

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =============================
  // FETCH RECENT ROOMS
  // =============================

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

        console.error(
          "Failed to fetch rooms:",
          error
        );


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


  // =============================
  // OPEN WORKSPACE
  // =============================

  const openRoom = (roomId) => {

    navigate(`/workspace/${roomId}`);

  };


  // =============================
  // LOADING STATE
  // =============================

  if (loading) {

    return (

      <section>

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-[#1E3A8A]">
            Recent Rooms
          </h2>

          <p className="text-[#64748B] mt-2">
            Loading your recent rooms...
          </p>

        </div>

      </section>

    );

  }


  // =============================
  // ERROR STATE
  // =============================

  if (error) {

    return (

      <section>

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-[#1E3A8A]">
            Recent Rooms
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

        </div>

      </section>

    );

  }


  return (

    <section>

      {/* ============================= */}
      {/* SECTION HEADER */}
      {/* ============================= */}

      <div className="flex items-start justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-[#1E3A8A]">
            Recent Rooms
          </h2>

          <p className="text-[#64748B] mt-2">
            Continue collaborating where you left off.
          </p>

        </div>


        {/* View All */}

        <Link
          to="/rooms"
          className="
            inline-flex
            items-center
            justify-center
            bg-[#DBEAFE]
            text-[#1D4ED8]
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
        </Link>

      </div>


      {/* ============================= */}
      {/* EMPTY STATE */}
      {/* ============================= */}

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

        /* ============================= */
        /* ROOM CARDS */
        /* ============================= */

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {rooms.map((room) => (

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

              {/* ============================= */}
              {/* ROOM ICON */}
              {/* ============================= */}

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-[#EFF6FF]
                  border
                  border-[#DBEAFE]
                  flex
                  items-center
                  justify-center
                  text-3xl
                  shadow-sm
                  group-hover:bg-[#DBEAFE]
                  transition-colors
                  duration-300
                "
              >
                🚀
              </div>


              {/* ============================= */}
              {/* ROOM DETAILS */}
              {/* ============================= */}

              <div className="flex-1">

                <h3
                  className="
                    mt-6
                    text-2xl
                    font-bold
                    text-[#1E3A8A]
                    truncate
                  "
                  title={room.name}
                >
                  {room.name}
                </h3>


                {/* Room Status */}

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                  "
                >

                  <FaCircle className="text-emerald-500 text-[10px]" />

                  <span className="text-sm text-[#64748B]">
                    {room.visibility} Room
                  </span>

                </div>


                {/* Members */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-[#64748B]
                  "
                >

                  <FaUsers className="text-[#94A3B8]" />

                  <span>
                    {room.participants?.length || 0} Members
                  </span>

                </div>


                {/* Language */}

                <div className="mt-4">

                  <p className="text-xs text-[#94A3B8]">
                    Language
                  </p>

                  <p className="mt-1 text-sm text-[#334155] font-medium">
                    {room.language}
                  </p>

                </div>

              </div>


              {/* ============================= */}
              {/* OPEN WORKSPACE */}
              {/* ============================= */}

              <button
                type="button"
                onClick={() => openRoom(room.roomId)}
                aria-label={`Open ${room.name} workspace`}
                className="
                  mt-8
                  w-full
                  bg-[#2563EB]
                  hover:bg-[#1D4ED8]
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
                  cursor-pointer
                "
              >

                <span>
                  Open Workspace
                </span>

                <FaArrowRight
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />

              </button>

            </div>

          ))}

        </div>

      )}

    </section>

  );

}