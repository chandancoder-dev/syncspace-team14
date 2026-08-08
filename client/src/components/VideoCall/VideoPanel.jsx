import VideoGrid from "./VideoGrid";
import VideoControls from "./VideoControls";

export default function VideoPanel({
  localVideoRef,
  stream,
  cameraOn,
  toggleCamera,
  stopCamera,
}) {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">

      {/* Header */}
      <div className="px-3 py-2 border-b border-blue-100 bg-white flex-shrink-0">
        <h3 className="text-xs font-semibold text-slate-700">
          Video Call
        </h3>
      </div>

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <VideoGrid
          localVideoRef={localVideoRef}
          stream={stream}
        />
      </div>

      {/* Controls */}
      <div className="border-t border-blue-100 p-2 bg-white flex-shrink-0">
        <VideoControls
          cameraOn={cameraOn}
          toggleCamera={toggleCamera}
          stopCamera={stopCamera}
        />
      </div>

    </div>
  );
}
