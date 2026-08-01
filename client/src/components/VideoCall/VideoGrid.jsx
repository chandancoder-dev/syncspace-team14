import VideoTile from "./VideoTile";

export default function VideoGrid() {
  return (
    <div className="flex flex-col gap-5">
      <VideoTile name="You" isSelf />
      <VideoTile name="Waiting..." />
      <VideoTile name="Waiting..." />
    </div>
  );
}