import DNavbar from "../components/DNavbar";
import WelcomeCard from "../components/WelcomeCard";
import StatsCard from "../components/StatsCard";
import ActionCard from "../components/ActionCard";
import RecentRooms from "../components/RecentRooms";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0F172A]">

      <DNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <WelcomeCard />

        {/* Statistics */}
        <StatsCard />

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          <ActionCard
            title="Create Collaboration Room"
            description="Create a new collaborative workspace for whiteboarding, coding and team discussions."
            button="Create Room"
          />

          <ActionCard
            title="Join Existing Room"
            description="Join your teammates instantly using a Room ID and continue collaborating in real time."
            button="Join Room"
          />

        </div>

        {/* Recent Rooms */}
        <div className="mt-10">

          <RecentRooms />

        </div>

      </div>

    </div>
  );
}