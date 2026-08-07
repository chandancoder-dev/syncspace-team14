import VideoTile from "./VideoTile";

export default function VideoGrid({
  localVideoRef,
  stream,
}) {
  return (
    <div className="grid grid-cols-1 gap-4">

      {/* Local participant */}
      <VideoTile
        name="You"
        isSelf={true}
        stream={stream}
        localVideoRef={localVideoRef}
      />

      {/* Other participant placeholders */}
      <VideoTile name="Waiting..." />
      <VideoTile name="Waiting..." />

    </div>
  );
}