import { Link, useNavigate } from "react-router-dom";

import rooms from "../data/rooms";

import {
  FaUsers,
  FaArrowRight,
  FaCircle,
} from "react-icons/fa";

export default function RecentRooms() {

  const navigate = useNavigate();

  const openRoom = (id) => {
    navigate(`/room/${id}`);
  };

  return (
    <section>

      {/* ============================= */}
      {/* SECTION HEADER */}
      {/* ============================= */}

      <div className="flex items-start justify-between mb-8">

        {/* Heading */}
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
      {/* ROOM CARDS */}
      {/* ============================= */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {rooms.map((room) => (

          <div
            key={room.id}
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

              {/* Room Name */}
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


              {/* ============================= */}
              {/* ROOM STATUS */}
              {/* ============================= */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                "
              >

                <FaCircle
                  className={
                    room.color === "green"
                      ? "text-emerald-500 text-[10px]"
                      : room.color === "blue"
                      ? "text-blue-500 text-[10px]"
                      : "text-slate-400 text-[10px]"
                  }
                />

                <span className="text-sm text-[#64748B]">
                  {room.status}
                </span>

              </div>


              {/* ============================= */}
              {/* MEMBERS */}
              {/* ============================= */}

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
                  {room.members} Members
                </span>

              </div>


              {/* ============================= */}
              {/* LAST ACTIVE */}
              {/* ============================= */}

              <div className="mt-4">

                <p className="text-xs text-[#94A3B8]">
                  Last Active
                </p>

                <p className="mt-1 text-sm text-[#334155] font-medium">
                  {room.lastActive}
                </p>

              </div>

            </div>


            {/* ============================= */}
            {/* OPEN WORKSPACE BUTTON */}
            {/* ============================= */}

            <button
              type="button"
              onClick={() => openRoom(room.id)}
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

    </section>
  );
}