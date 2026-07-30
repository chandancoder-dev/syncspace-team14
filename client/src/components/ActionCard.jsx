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
        relative
        overflow-hidden
        bg-white
        border
       border-2 border-[#93C5FD]
        rounded-3xl
        p-7
        lg:p-8
        shadow-[0_4px_20px_rgba(37,99,235,0.06)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-2
        hover:border-[#2563EB]
        hover:shadow-[0_18px_40px_rgba(37,99,235,0.15)]
      "
    >

      {/* ============================= */}
      {/* SUBTLE TOP HIGHLIGHT */}
      {/* ============================= */}

      <div
        className="
          absolute
          top-0
          left-8
          right-8
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#60A5FA]
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />


      {/* ============================= */}
      {/* ICON */}
      {/* ============================= */}

      <div
        className="
          relative
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
          group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.15)]
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
          leading-tight
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
          leading-7
          text-base
          lg:text-lg
        "
      >
        {description}
      </p>


      {/* ============================= */}
      {/* FEATURES */}
      {/* ============================= */}

      <div className="space-y-2 mt-7 text-[#475569]">

        {/* Feature 1 */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-lg
            px-2
            py-2
            transition-all
            duration-300
            hover:bg-[#F8FBFF]
          "
        >
          <FaCheckCircle
            className="
              text-emerald-500
              shrink-0
              text-lg
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <span className="text-sm lg:text-base">
            Real-Time Collaboration
          </span>
        </div>


        {/* Feature 2 */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-lg
            px-2
            py-2
            transition-all
            duration-300
            hover:bg-[#F8FBFF]
          "
        >
          <FaCheckCircle
            className="
              text-emerald-500
              shrink-0
              text-lg
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <span className="text-sm lg:text-base">
            Shared Whiteboard
          </span>
        </div>


        {/* Feature 3 */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-lg
            px-2
            py-2
            transition-all
            duration-300
            hover:bg-[#F8FBFF]
          "
        >
          <FaCheckCircle
            className="
              text-emerald-500
              shrink-0
              text-lg
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <span className="text-sm lg:text-base">
            Live Code Editor
          </span>
        </div>

      </div>


      {/* ============================= */}
      {/* BUTTON */}
      {/* ============================= */}

      <button
        type="button"
        onClick={onClick}
        className="
          w-full
          mt-8
          bg-gradient-to-r
          from-[#2563EB]
          to-[#3B82F6]
          hover:from-[#1D4ED8]
          hover:to-[#2563EB]
          py-4
          rounded-xl
          text-white
          font-semibold
          flex
          justify-center
          items-center
          gap-2
          shadow-md
          shadow-blue-200/50
          hover:shadow-lg
          hover:shadow-blue-300/50
          hover:-translate-y-0.5
          active:translate-y-0
          transition-all
          duration-300
          cursor-pointer
          focus:outline-none
          focus:ring-2
          focus:ring-[#60A5FA]
          focus:ring-offset-2
        "
      >
        <span>
          {button}
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
  );
}