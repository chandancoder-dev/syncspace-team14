import { useEffect, useRef, useState } from "react";

export default function useVideoCall() {
  const localVideoRef = useRef(null);

  const [stream, setStream] = useState(null);

  useEffect(() => {
    let mediaStream;

    const startCamera = async () => {
      try {
        mediaStream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        setStream(mediaStream);
      } catch (err) {
        console.error(err);
      }
    };

    startCamera();

    return () => {
      mediaStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

 useEffect(() => {
  if (localVideoRef.current && stream) {
    localVideoRef.current.srcObject = stream;

    localVideoRef.current
      .play()
      .catch(err => console.log(err));
  }
}, [stream]);
  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
  };

  return {
    localVideoRef,
    stream,
    stopCamera,
  };
}