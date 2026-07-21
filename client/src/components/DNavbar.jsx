import { FiLogOut, FiBell } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DNavbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Backend logout will be added later
    navigate("/login");
  };

  return (

    <nav
      className="
        bg-white
        border-b
        border-[#DBEAFE]
        shadow-sm
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          h-20
          px-6
          flex
          items-center
          justify-between
        "
      >

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-[#2563EB]
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-xl
              shadow-md
              shadow-blue-200
            "
          >
            S
          </div>

          <div>

            <h1 className="text-[#1E3A8A] text-3xl font-bold">
              SyncSpace
            </h1>

            <p className="text-[#64748B] text-sm">
              Real-Time Collaboration Platform
            </p>

          </div>

        </div>


        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* Notification */}
          <button
            className="
              relative
              p-3
              rounded-xl
              bg-[#F8FAFC]
              border
              border-[#DBEAFE]
              hover:border-[#60A5FA]
              hover:bg-[#EFF6FF]
              transition
            "
          >

            <FiBell className="text-[#334155] text-xl" />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-5
                h-5
                bg-red-500
                rounded-full
                text-xs
                flex
                items-center
                justify-center
                text-white
                font-medium
              "
            >
              3
            </span>

          </button>


          {/* User */}
          <div
            className="
              hidden
              md:flex
              items-center
              gap-3
              bg-[#F8FAFC]
              border
              border-[#DBEAFE]
              rounded-xl
              px-4
              py-2
            "
          >

            <FaRegUserCircle
              className="text-[#2563EB]"
              size={28}
            />

            <div>

              <p className="text-[#1E293B] font-semibold">
                Pratiksha
              </p>

              <p className="text-[#64748B] text-xs">
                Developer
              </p>

            </div>

          </div>


          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              flex
              items-center
              gap-2
              bg-red-500
              hover:bg-red-600
              px-5
              py-3
              rounded-xl
              text-white
              font-medium
              shadow-sm
              hover:shadow-md
              transition
              duration-300
            "
          >

            <FiLogOut />

            Logout

          </button>

        </div>

      </div>

    </nav>

  );
}