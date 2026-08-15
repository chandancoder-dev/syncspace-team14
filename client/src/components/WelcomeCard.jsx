import { useEffect, useState } from "react";
import { Sparkles, PlusCircle, ArrowRight, History } from "lucide-react";

export default function WelcomeCard({ onCreateRoomClick, onRecentClick }) {
  const getUserName = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const name =
        user.username ||
        user.userName ||
        user.email?.split("@")[0] ||
        user.name?.split(" ")[0] ||
        user.fullName?.split(" ")[0] ||
        "User";

      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return "User";
    }
  };

  const [userName, setUserName] = useState(getUserName);

  useEffect(() => {
    const updateUserName = () => {
      setUserName(getUserName());
    };

    window.addEventListener("storage", updateUserName);
    window.addEventListener("userUpdated", updateUserName);

    return () => {
      window.removeEventListener("storage", updateUserName);
      window.removeEventListener("userUpdated", updateUserName);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] via-white to-[#E8F1FF] p-8 shadow-sm">
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center">

        {/* LEFT */}
        <div className="flex-1">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB]">
            <Sparkles className="h-4 w-4" />
            SyncSpace Workspace
          </p>

          <h1 className="text-4xl font-extrabold leading-tight text-[#1E3A8A] lg:text-5xl">
            Welcome,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-[#475569] lg:text-lg">
            Your collaborative workspace is ready. Work together, share ideas,
            and build in real-time.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-[#475569] shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Ready to collaborate
          </div>
        </div>

        {/* DIVIDER */}
        <div className="hidden h-36 w-px bg-blue-200/70 lg:block" />

        {/* QUICK ACTIONS */}
        <div className="w-full shrink-0 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-[0_10px_30px_rgba(37,99,235,0.08)] lg:w-[390px]">

          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1E3A8A]">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                Jump straight into your workspace
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <button
            onClick={onCreateRoomClick}
            className="group flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-5 py-3.5 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <PlusCircle className="h-5 w-5" />
              </span>

              <span className="text-left">
                <span className="block font-semibold">Create Room</span>
                <span className="text-xs text-blue-100">
                  Start a new collaboration
                </span>
              </span>
            </span>

            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>

          <button
            onClick={onRecentClick}
            className="group mt-3 flex w-full items-center justify-between rounded-2xl border border-blue-100 bg-[#F8FAFF] px-5 py-3.5 text-blue-600 transition hover:bg-blue-50"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <History className="h-5 w-5" />
              </span>

              <span className="text-left">
                <span className="block font-medium">Recent Activity</span>
                <span className="text-xs text-[#64748B]">
                  View your recent rooms
                </span>
              </span>
            </span>

            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>

        </div>
      </div>
    </section>
  );
}