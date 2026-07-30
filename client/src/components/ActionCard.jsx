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
        group
        bg-white
        border
        border-[#BFDBFE]
        rounded-3xl
        p-7
        shadow-sm
        transition-all
        duration-300
        ease-in-out
        hover:-translate-y-2
        hover:border-[#3B82F6]
        hover:shadow-xl
        hover:shadow-blue-200/60
        hover:bg-gradient-to-br
        hover:from-white
        hover:to-[#F8FBFF]
      "
    >

      {/* ============================= */}
      {/* ICON */}
      {/* ============================= */}

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
          border
          border-[#DBEAFE]
          shadow-sm
          transition-all
          duration-300
          group-hover:bg-[#DBEAFE]
          group-hover:border-[#93C5FD]
          group-hover:shadow-md
          group-hover:scale-105
        "
      >
        {icon}
      </div>


      {/* ============================= */}
      {/* TITLE */}
      {/* ============================= */}

      <h2
        className="
          text-2xl
          lg:text-3xl
          font-bold
          text-[#1E3A8A]
          transition-colors
          duration-300
          group-hover:text-[#2563EB]
        "
      >
        {title}
      </h2>


      {/* ============================= */}
      {/* DESCRIPTION */}
      {/* ============================= */}

      <p
        className="
          text-[#64748B]
          mt-4
          leading-8
        "
      >
        {description}
      </p>


      {/* ============================= */}
      {/* FEATURES */}
      {/* ============================= */}

      <div className="space-y-3 mt-6 text-[#475569]">

        <div
          className="
            flex
            items-center
            gap-3
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          <FaCheckCircle
            className="
              text-emerald-500
              shrink-0
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <span>
            Real-Time Collaboration
          </span>
        </div>


        <div
          className="
            flex
            items-center
            gap-3
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          <FaCheckCircle
            className="
              text-emerald-500
              shrink-0
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <span>
            Shared Whiteboard
          </span>
        </div>


        <div
          className="
            flex
            items-center
            gap-3
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          <FaCheckCircle
            className="
              text-emerald-500
              shrink-0
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <span>
            Live Code Editor
          </span>
        </div>

      </div>


      {/* ============================= */}
      {/* BUTTON */}
      {/* ============================= */}

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

        <FaArrowRight
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />
      </button>

    </div>
  );
}