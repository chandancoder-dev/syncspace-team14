import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhoneOff,
} from "react-icons/fi";
import { useState } from "react";

export default function VideoControls({
  cameraOn,
  toggleCamera,
  stopCamera,
}) {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-blue-100 shadow-sm">
        {/* Mic toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute" : "Mute"}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:scale-105 ${
            isMuted
              ? "bg-red-100 text-red-600 border border-red-200"
              : "border border-blue-100 bg-blue-50 text-blue-900 hover:bg-blue-100"
          }`}
        >
          {isMuted ? <FiMicOff /> : <FiMic />}
        </button>

        {/* Camera toggle */}
        <button
          onClick={toggleCamera}
          title={cameraOn ? "Turn camera off" : "Turn camera on"}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:scale-105 ${
            cameraOn
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-600 border border-red-200"
          }`}
        >
          {cameraOn ? <FiVideo /> : <FiVideoOff />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-blue-100" />

        {/* End call */}
        <button
          onClick={stopCamera}
          title="Leave call"
          className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200 hover:scale-105"
        >
          <FiPhoneOff />
        </button>
      </div>
    </div>
  );
}