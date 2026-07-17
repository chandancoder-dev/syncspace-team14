import {
  PlusCircle,
  LogIn,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Layers,
  LayoutDashboard,
  MessageSquare,
  FileCode2,
  Settings,
  LogOut,
} from "lucide-react";

function Dashboard() {
  return (
    <div className="min-h-[calc(100vh-2rem)]">
      <div className="grid min-h-[calc(100vh-2rem)] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/20 backdrop-blur sticky top-6 h-fit">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">SyncSpace</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Collaboration tools for your active rooms and sessions.
            </p>
          </div>

          <nav className="mt-4 space-y-2">
            <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" active />
            <SidebarLink icon={<Users size={18} />} label="Members" />
            <SidebarLink icon={<MessageSquare size={18} />} label="Rooms" />
            <SidebarLink icon={<FileCode2 size={18} />} label="Editor" />
            <SidebarLink icon={<Settings size={18} />} label="Settings" />
          </nav>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="mt-1 font-medium text-white">Team Lead</p>
            <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:border-blue-500 hover:text-white">
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <header className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Dashboard
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back, Pratiksha...
              </h2>
              <p className="text-sm leading-6 text-slate-400 sm:text-base">
                Create rooms, track members, and jump into active collaboration
                without the page stretching past a readable width.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
                <PlusCircle size={18} />
                Create Room
              </button>

              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500 px-5 py-3 text-sm font-medium text-blue-400 transition hover:bg-blue-600 hover:text-white">
                <LogIn size={18} />
                Join Room
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={<Layers />} title="Rooms" value="12" />
            <StatCard icon={<Users />} title="Members" value="18" />
            <StatCard icon={<Clock />} title="Sessions" value="25" />
            <StatCard icon={<CheckCircle2 />} title="Completed" value="20" />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <h2 className="mb-5 text-xl font-semibold text-white">
                Recent Rooms
              </h2>

              <div className="space-y-3">
                <RoomItem room="Java Interview Prep" members="5 Members" />
                <RoomItem room="MERN Project" members="6 Members" />
                <RoomItem room="DSA Practice" members="3 Members" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <h2 className="mb-5 text-xl font-semibold text-white">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <ActionButton title="Open Whiteboard" />
                <ActionButton title="Invite Team" />
                <ActionButton title="Settings" />
                <ActionButton title="Documentation" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 transition hover:border-blue-500">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-white sm:text-[2.15rem]">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-blue-600/20 p-3 text-blue-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

function RoomItem({ room, members }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-4 transition hover:border-blue-500/50">
      <div className="min-w-0">
        <h3 className="truncate text-white">{room}</h3>
        <p className="text-sm text-slate-400">{members}</p>
      </div>

      <ArrowRight className="shrink-0 text-blue-500" />
    </div>
  );
}

function ActionButton({ title }) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-4 text-white transition hover:border-blue-500/50 hover:bg-slate-700">
      <span>{title}</span>
      <ArrowRight className="shrink-0 text-blue-500" />
    </button>
  );
}

function SidebarLink({ icon, label, active = false }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className={active ? "text-white" : "text-blue-400"}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default Dashboard;