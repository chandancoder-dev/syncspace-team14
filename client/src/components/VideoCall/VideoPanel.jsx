import VideoGrid from "./VideoGrid";
import VideoControls from "./VideoControls";

export default function VideoPanel({
  localVideoRef,
  stream,
  stopCamera,
}) {
  return (
    <div className="h-full flex flex-col bg-white">

      <div className="px-4 py-3 border-b border-blue-100 bg-white sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-slate-700">
          Participants (3)
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <VideoGrid
          localVideoRef={localVideoRef}
          stream={stream}
        />
      </div>

      <div className="border-t border-blue-100 p-4 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <VideoControls
          stream={stream}
          stopCamera={stopCamera}
        />
      </div>

    </div>
  );
}