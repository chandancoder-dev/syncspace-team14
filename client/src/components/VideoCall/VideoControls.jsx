import {
  FiMic,
  FiVideo,
  FiMonitor,
  FiPhoneOff,
} from "react-icons/fi";

const buttonClass =
  "w-11 h-11 rounded-full border border-blue-100 bg-blue-50 text-blue-900 flex items-center justify-center text-lg transition-all duration-200 hover:bg-blue-100 hover:scale-105";

export default function VideoControls() {
  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-full border border-blue-100 shadow-sm">

        {/* Microphone */}
        <button
          title="Mute / Unmute"
          className={buttonClass}
        >
          <FiMic />
        </button>

        {/* Camera */}
        <button
          title="Camera On / Off"
          className={buttonClass}
        >
          <FiVideo />
        </button>

        {/* Screen Share */}
        <button
          title="Share Screen"
          className={buttonClass}
        >
          <FiMonitor />
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-blue-100" />

        {/* Leave */}
        <button
          title="Leave Call"
          className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl transition-all duration-200 hover:bg-red-700 hover:scale-105"
        >
          <FiPhoneOff />
        </button>

      </div>
    </div>
  );
}