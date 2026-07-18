import { useNavigate } from "react-router-dom";

import {
  FaPlusCircle,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import { MdMeetingRoom } from "react-icons/md";

export default function ActionCard({
  title,
  description,
  button,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (button === "Create Room") {
      navigate("/create-room");
    } else {
      navigate("/join-room");
    }
  };

  const isCreate = button === "Create Room";

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[#334155]
        bg-[#1E293B]
        p-8
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-[#2563EB]
        hover:shadow-2xl
      "
    >
      {/* Glow Effect */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#2563EB]/10 blur-3xl"></div>

      <div className="relative z-10">

        {/* Icon */}
        <div className="mb-6">

          {isCreate ? (
            <FaPlusCircle
              size={48}
              className="text-[#3B82F6]"
            />
          ) : (
            <MdMeetingRoom
              size={52}
              className="text-[#22C55E]"
            />
          )}

        </div>

        {/* Title */}

        <h2 className="text-3xl font-bold text-white">

          {title}

        </h2>

        {/* Description */}

        <p className="mt-4 text-[#CBD5E1] leading-7">

          {description}

        </p>

        {/* Features */}

        <div className="mt-8 space-y-3">

          <div className="flex items-center gap-3">

            <FaCheckCircle className="text-green-400" />

            <span className="text-[#CBD5E1]">
              Real-Time Collaboration
            </span>

          </div>

          <div className="flex items-center gap-3">

            <FaCheckCircle className="text-green-400" />

            <span className="text-[#CBD5E1]">
              Shared Whiteboard
            </span>

          </div>

          <div className="flex items-center gap-3">

            <FaCheckCircle className="text-green-400" />

            <span className="text-[#CBD5E1]">
              Live Code Editor
            </span>

          </div>

        </div>

        {/* Button */}

        <button
          onClick={handleClick}
          className="
            mt-10
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-[#2563EB]
            px-6
            py-4
            text-lg
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-[#1D4ED8]
          "
        >
          {button}

          <FaArrowRight />
        </button>

      </div>
    </div>
  );
}