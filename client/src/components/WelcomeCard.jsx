import { FaPlus, FaUsers } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { IoFlash } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function WelcomeCard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Online Users",
      value: "8",
      icon: <FaUsers />,
      color: "text-green-400",
    },
    {
      title: "Active Rooms",
      value: "5",
      icon: <MdMeetingRoom />,
      color: "text-blue-400",
    },
    {
      title: "Today's Sessions",
      value: "23",
      icon: <IoFlash />,
      color: "text-yellow-400",
    },
  ];

  return (
    <div
      className="
      rounded-3xl
      bg-gradient-to-r
      from-[#2B3648]
      via-[#313D52]
      to-[#334A7D]
      border
      border-[#475569]
      p-8
      shadow-xl
    "
    >
      <div className="grid lg:grid-cols-2 gap-8 items-center">

        {/* LEFT SECTION */}

        <div>

          <h1 className="text-5xl font-bold text-white">
            Welcome Back 👋
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#CBD5E1] max-w-xl">
            Build, draw, code and collaborate with your teammates in
            real-time using SyncSpace. Create a room or join your
            existing workspace instantly.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap">

            <button
              onClick={() => navigate("/create-room")}
              className="
              flex
              items-center
              gap-3
              px-7
              py-3
              rounded-xl
              bg-[#2563EB]
              hover:bg-[#1D4ED8]
              hover:scale-105
              transition-all
              duration-300
              text-white
              font-semibold
              shadow-lg
            "
            >
              <FaPlus />
              Create Room
            </button>

            <button
              onClick={() => navigate("/join-room")}
              className="
              px-7
              py-3
              rounded-xl
              border
              border-[#475569]
              bg-[#111827]
              hover:border-[#2563EB]
              hover:bg-[#1E293B]
              transition-all
              duration-300
              text-white
              font-semibold
            "
            >
              Join Room
            </button>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="grid grid-cols-3 gap-4">

          {stats.map((item) => (

            <div
              key={item.title}
              className="
              bg-[#111827]
              rounded-2xl
              border
              border-[#334155]
              p-5
              text-center
              hover:border-[#2563EB]
              hover:-translate-y-1
              hover:shadow-lg
              hover:shadow-blue-500/20
              transition-all
              duration-300
            "
            >

              <div className={`text-3xl mb-3 ${item.color}`}>
                {item.icon}
              </div>

              <h2 className="text-4xl font-bold text-white">
                {item.value}
              </h2>

              <p className="text-sm text-[#CBD5E1] mt-2">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}