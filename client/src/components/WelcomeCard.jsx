import { FaPlus, FaUsers } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function WelcomeCard() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  const handleJoinRoom = () => {
    navigate("/join-room");
  };

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[#334155]
        bg-linear-to-r
        from-[#1E293B]
        via-[#1E293B]
        to-[#172554]
        p-10
        shadow-xl
      "
    >
      {/* Decorative Circle */}
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#2563EB]/20 blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

        {/* Left Section */}
        <div>

          <div className="flex items-center gap-3">

            <HiOutlineSparkles
              className="text-yellow-400"
              size={34}
            />

            <h2 className="text-5xl font-bold text-white">
              Welcome Back
            </h2>

          </div>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#CBD5E1]">
            Build, draw, code and collaborate with your teammates in
            real-time. Create a room or join an existing workspace to
            start collaborating instantly.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">

            <button
              onClick={handleCreateRoom}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-[#2563EB]
                px-6
                py-3
                font-semibold
                text-white
                transition
                duration-300
                hover:bg-[#1D4ED8]
                hover:scale-105
              "
            >
              <FaPlus />

              Create Room
            </button>

            <button
              onClick={handleJoinRoom}
              className="
                rounded-xl
                border
                border-[#334155]
                bg-[#0F172A]
                px-6
                py-3
                font-semibold
                text-white
                transition
                duration-300
                hover:border-[#2563EB]
                hover:bg-[#1E293B]
              "
            >
              Join Room
            </button>

          </div>

        </div>

        {/* Right Section */}

        <div className="grid grid-cols-2 gap-5">

          <div className="rounded-2xl bg-[#0F172A]/70 p-5 border border-[#334155]">

            <FaUsers
              className="text-blue-400 mb-3"
              size={28}
            />

            <h3 className="text-3xl font-bold text-white">
              8
            </h3>

            <p className="text-[#CBD5E1]">
              Online Users
            </p>

          </div>

          <div className="rounded-2xl bg-[#0F172A]/70 p-5 border border-[#334155]">

            <MdMeetingRoom
              className="text-green-400 mb-3"
              size={28}
            />

            <h3 className="text-3xl font-bold text-white">
              5
            </h3>

            <p className="text-[#CBD5E1]">
              Active Rooms
            </p>

          </div>

          <div className="rounded-2xl bg-[#0F172A]/70 p-5 border border-[#334155]">

            <h3 className="text-3xl font-bold text-white">
              23
            </h3>

            <p className="text-[#CBD5E1]">
              Sessions Today
            </p>

          </div>

          <div className="rounded-2xl bg-[#0F172A]/70 p-5 border border-[#334155]">

            <h3 className="text-3xl font-bold text-white">
              99.9%
            </h3>

            <p className="text-[#CBD5E1]">
              Sync Accuracy
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}