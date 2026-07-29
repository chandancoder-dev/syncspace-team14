import { FiLogOut } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DNavbar() {
  const navigate = useNavigate();

  // Logout popup state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Get currently logged-in user from localStorage
  const getUserName = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return "User";
    }

    try {
      const user = JSON.parse(storedUser);

      return (
        user.name ||
        user.username ||
        user.fullName ||
        user.email?.split("@")[0] ||
        "User"
      );
    } catch (error) {
      console.error("Failed to read logged-in user:", error);
      return "User";
    }
  };

  // Current user's name
  const userName = getUserName();


  // =============================
  // OPEN LOGOUT POPUP
  // =============================

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };


  // =============================
  // CONFIRM LOGOUT
  // =============================

  const confirmLogout = () => {

    // Remove login information
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("syncspace_user");

    // Close popup
    setShowLogoutPopup(false);

    // Hard redirect to home (avoids React re-render loop)
    window.location.href = "/";
  };


  // =============================
  // CANCEL LOGOUT
  // =============================

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };


  return (
    <>
      {/* ============================= */}
      {/* NAVBAR */}
      {/* ============================= */}

      <nav className="bg-white border-b border-[#DBEAFE] shadow-sm">

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

          {/* ============================= */}
          {/* LOGO */}
          {/* ============================= */}

          <div className="flex items-center gap-3">

            <img
              src="/SyncSpace.png"
              alt="SyncSpace"
              className="w-10 h-10 rounded-xl shadow-md shadow-blue-200"
            />

            <h1 className="text-[#1E3A8A] text-3xl font-bold">
              SyncSpace
            </h1>

          </div>


          {/* ============================= */}
          {/* RIGHT SECTION */}
          {/* ============================= */}

          <div className="flex items-center gap-5">

            {/* ============================= */}
            {/* LOGGED-IN USER */}
            {/* ============================= */}

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
                transition-all
                duration-300
                hover:bg-[#EFF6FF]
                hover:border-[#60A5FA]
                hover:shadow-md
              "
            >

              <FaRegUserCircle
                className="text-[#2563EB]"
                size={28}
              />

              <p className="text-[#1E293B] font-semibold">
                {userName}
              </p>

            </div>


            {/* ============================= */}
            {/* LOGOUT BUTTON */}
            {/* ============================= */}

            <button
              type="button"
              onClick={handleLogoutClick}
              className="
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                font-medium
                border-2
                border-blue-200
                text-slate-500
                bg-transparent
                hover:bg-red-50
                hover:border-red-300
                hover:text-red-600
                transition-all
                duration-300
              "
            >

              <FiLogOut />

              Logout

            </button>

          </div>

        </div>

      </nav>


      {/* ============================= */}
      {/* LOGOUT CONFIRMATION POPUP */}
      {/* ============================= */}

      {showLogoutPopup && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
            px-4
          "
        >

          {/* Popup Box */}

          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-2xl
              shadow-2xl
              p-7
              border
              border-[#DBEAFE]
              animate-[fadeIn_0.2s_ease-out]
            "
          >

            {/* Logout Icon */}

            <div
              className="
                w-14
                h-14
                mx-auto
                rounded-full
                bg-red-50
                flex
                items-center
                justify-center
                text-red-500
                text-2xl
              "
            >
              <FiLogOut />
            </div>


            {/* Heading */}

            <h2
              className="
                mt-5
                text-2xl
                font-bold
                text-[#1E3A8A]
                text-center
              "
            >
              Confirm Logout
            </h2>


            {/* Message */}

            <p
              className="
                mt-3
                text-[#64748B]
                text-center
                leading-6
              "
            >
              Are you sure you want to logout from SyncSpace?
            </p>


            {/* Buttons */}

            <div className="mt-7 flex gap-4">

              {/* Cancel Button */}

              <button
                type="button"
                onClick={cancelLogout}
                className="
                  flex-1
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-[#CBD5E1]
                  text-[#475569]
                  font-semibold
                  hover:bg-[#F8FAFC]
                  hover:border-[#94A3B8]
                  transition-all
                  duration-300
                "
              >
                Cancel
              </button>


              {/* Logout Button */}

              <button
                type="button"
                onClick={confirmLogout}
                className="
                  flex-1
                  px-5
                  py-3
                  rounded-xl
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  font-semibold
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}