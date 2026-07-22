import { useNavigate } from "react-router-dom";

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

      {/* Heading */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-white">

            Recent Rooms

          </h2>

          <p className="text-[#94A3B8] mt-2">

            Continue collaborating where you left off.

          </p>

        </div>

        <button
          className="
            text-[#3B82F6]
            font-medium
            hover:text-white
            transition
          "
        >
          View All
        </button>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {rooms.map((room) => (

          <div
            key={room.id}
            className="
              bg-[#1E293B]
              rounded-3xl
              border
              border-[#334155]
              p-6
              hover:border-[#2563EB]
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
            "
          >

            {/* Room Icon */}

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#2563EB]/20
                flex
                items-center
                justify-center
                text-3xl
              "
            >
              🚀
            </div>

            {/* Room Name */}

            <h3
              className="
                mt-6
                text-2xl
                font-bold
                text-white
              "
            >
              {room.name}
            </h3>

            {/* Status */}

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
                    ? "text-green-500 text-xs"
                    : room.color === "blue"
                    ? "text-blue-500 text-xs"
                    : "text-gray-500 text-xs"
                }
              />

              <span className="text-[#CBD5E1]">

                {room.status}

              </span>

            </div>

            {/* Members */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
                text-[#CBD5E1]
              "
            >

              <FaUsers />

              {room.members} Members

            </div>

            {/* Last Active */}

            <div className="mt-3">

              <p className="text-sm text-[#94A3B8]">

                Last Active

              </p>

              <p className="text-white">

                {room.lastActive}

              </p>

            </div>

            {/* Button */}

            <button
              onClick={() => openRoom(room.id)}
              className="
                mt-8
                w-full
                bg-[#2563EB]
                hover:bg-[#1D4ED8]
                rounded-xl
                py-3
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-3
                transition
              "
            >

              Open Workspace

              <FaArrowRight />

            </button>

          </div>

        ))}

      </div>

    </section>

  );

}