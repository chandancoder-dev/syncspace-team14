import {
  FaUsers,
  FaDoorOpen,
  FaCode,
  FaBolt,
} from "react-icons/fa";

const stats = [
  {
    id: 1,
    title: "Online Users",
    value: "18",
    icon: <FaUsers />,
    color: "text-green-400",
  },
  {
    id: 2,
    title: "Active Rooms",
    value: "6",
    icon: <FaDoorOpen />,
    color: "text-blue-400",
  },
  {
    id: 3,
    title: "Live Sessions",
    value: "12",
    icon: <FaCode />,
    color: "text-purple-400",
  },
  {
    id: 4,
    title: "Messages Synced",
    value: "1,245",
    icon: <FaBolt />,
    color: "text-yellow-400",
  },
];

export default function StatsCard() {
  return (
    <div className="grid gap-6 mt-8 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => (

        <div
          key={item.id}
          className="
            bg-[#1E293B]
            border
            border-[#334155]
            rounded-2xl
            p-6
            hover:border-[#2563EB]
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-[#94A3B8] text-sm">

                {item.title}

              </p>

              <h2 className="text-4xl font-bold text-white mt-3">

                {item.value}

              </h2>

            </div>

            <div
              className={`text-4xl ${item.color}`}
            >
              {item.icon}
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}