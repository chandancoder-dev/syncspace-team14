import {
  FiMic,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiPhoneOff,
} from "react-icons/fi";

const buttonClass =
  "w-11 h-11 rounded-full border border-blue-100 bg-blue-50 text-blue-900 flex items-center justify-center text-lg transition-all duration-200 hover:bg-blue-100 hover:scale-105";

export default function VideoControls({
  cameraOn,
  toggleCamera,
  stopCamera,
}) {
  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-full border border-blue-100 shadow-sm">

        <button className={buttonClass}>
          <FiMic />
        </button>

        <button
          onClick={toggleCamera}
          className={
            cameraOn
              ? "w-11 h-11 rounded-full bg-green-600 text-white flex items-center justify-center text-lg"
              : "w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center text-lg"
          }
        >
          {cameraOn ? <FiVideo /> : <FiVideoOff />}
        </button>

        <button className={buttonClass}>
          <FiMonitor />
        </button>

        <div className="w-px h-7 bg-blue-100" />

        <button
          onClick={stopCamera}
          className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl hover:bg-red-700"
        >
          <FiPhoneOff />
        </button>

      </div>
    </div>
  );
}