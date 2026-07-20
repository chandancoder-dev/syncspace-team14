import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

export default function ActionCard({ title, description, button, icon }) {
  return (
    <div
      className="
      bg-[#263247]
      border
      border-[#3B4A63]
      rounded-3xl
      p-7
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-[#2563EB]
      hover:shadow-xl
      hover:shadow-blue-500/20
    "
    >
      <div className="text-5xl mb-6 text-[#3B82F6]">{icon}</div>

      <h2 className="text-3xl font-bold text-white">{title}</h2>

      <p className="text-[#CBD5E1] mt-4 leading-8">{description}</p>

      <div className="space-y-3 mt-6 text-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-400" />
          Real-Time Collaboration
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-400" />
          Shared Whiteboard
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-400" />
          Live Code Editor
        </div>
      </div>

      <button
        className="
        w-full
        mt-8
        bg-[#2563EB]
        hover:bg-[#1D4ED8]
        py-4
        rounded-xl
        text-white
        font-semibold
        flex
        justify-center
        items-center
        gap-2
        transition-all
      "
      >
        {button}
        <FaArrowRight />
      </button>
    </div>
  );
}