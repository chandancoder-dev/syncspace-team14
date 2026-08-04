import VideoTile from "./VideoTile";

export default function VideoGrid({ localVideoRef, stream }) {
  return (
    <div className="flex flex-col gap-5">
      <VideoTile
        name="You"
        isSelf
        localVideoRef={localVideoRef}
        stream={stream}
      />

      <VideoTile name="Waiting..." />
      <VideoTile name="Waiting..." />
    </div>
  );
}