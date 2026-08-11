import VideoTile from "./VideoTile";

export default function VideoGrid({
  localVideoRef,
  stream,
}) {
  return (
    <div className="flex flex-col gap-5">
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