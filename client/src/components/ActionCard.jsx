import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

export default function ActionCard({
  title,
  description,
  button,
  icon,
  onClick,
}) {
  return (
    <div
      className="
        bg-white
        border
        border-[#BFDBFE]
        rounded-3xl
        p-7
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-[#60A5FA]
        hover:shadow-xl
        hover:shadow-blue-200/50
      "
    >

      {/* Icon */}
      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-[#EFF6FF]
          flex
          items-center
          justify-center
          text-4xl
          mb-6
          text-[#2563EB]
        "
      >
        {icon}
      </div>


      {/* Title */}
      <h2 className="text-2xl lg:text-3xl font-bold text-[#1E3A8A]">
        {title}
      </h2>


      {/* Description */}
      <p className="text-[#64748B] mt-4 leading-8">
        {description}
      </p>


      {/* Features */}
      <div className="space-y-3 mt-6 text-[#475569]">

        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-emerald-500 shrink-0" />
          <span>Real-Time Collaboration</span>
        </div>

        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-emerald-500 shrink-0" />
          <span>Shared Whiteboard</span>
        </div>

        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-emerald-500 shrink-0" />
          <span>Live Code Editor</span>
        </div>

      </div>


      {/* Button */}
      <button
        onClick={onClick}
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
          shadow-sm
          hover:shadow-lg
          hover:shadow-blue-200
          transition-all
          duration-300
        "
      >
        {button}

        <FaArrowRight />
      </button>

    </div>
  );
}