import { FiVideoOff, FiMicOff } from "react-icons/fi";

const getInitials = (name = "") => {
  const trimmed = name.trim();

  if (!trimmed || trimmed === "Waiting...") return "…";

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (
    parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase();
};

export default function VideoTile({
  name,
  isSelf = false,
  localVideoRef,
  stream,
}) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-800">
      {/* Show Live Camera */}
      {isSelf && stream ? (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold ${
              isSelf ? "bg-blue-600" : "bg-slate-500"
            }`}
          >
            {getInitials(name)}
          </div>

          <div className="mt-3 flex items-center gap-2 text-slate-300 text-sm">
            <FiVideoOff />
            <span>Camera Off</span>
          </div>
        </div>
      )}

      {/* Mic Status */}
      <div className="absolute top-3 left-3 bg-red-500 rounded-full p-1 text-white z-10">
        <FiMicOff size={12} />
      </div>

      {/* You Badge */}
      {isSelf && (
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full z-10">
          You
        </div>
      )}

      {/* Participant Name */}
      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full z-10">
        {name}
      </div>
    </div>
  );
}