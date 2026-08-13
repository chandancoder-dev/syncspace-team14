import { useNavigate } from "react-router-dom";
import DNavbar from "../components/DNavbar";
import WelcomeCard from "../components/WelcomeCard";
import ActionCard from "../components/ActionCard";
import RecentRooms from "../components/RecentRooms";

import { FaPlusCircle } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleScrollToActionCards = () => {
    const section = document.getElementById("action-cards");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToRecentRooms = () => {
    const section = document.getElementById("recent-rooms");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Navbar */}
      <DNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <WelcomeCard
          onCreateRoomClick={handleScrollToActionCards}
          onRecentClick={handleScrollToRecentRooms}
        />

        {/* Action Cards */}
        <div id="action-cards" className="grid lg:grid-cols-2 gap-8 mt-10">
          <ActionCard
            icon={<FaPlusCircle />}
            title="Create Collaboration Room"
            description="Create a new collaborative workspace for whiteboarding, coding and team discussions."
            button="Create Room"
            onClick={() => navigate("/createroom")}
          />

          <ActionCard
            icon={<MdMeetingRoom />}
            title="Join Existing Room"
            description="Join your teammates instantly using a Room ID and continue collaborating in real time."
            button="Join Room"
            onClick={() => navigate("/joinroom")}
          />
        </div>

        {/* Recent Rooms */}
        <div id="recent-rooms" className="mt-12">
          <RecentRooms />
        </div>
      </main>
    </div>
  );
}