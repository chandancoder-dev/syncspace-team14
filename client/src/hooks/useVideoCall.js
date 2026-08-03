import { useEffect, useRef, useState } from "react";

export default function useVideoCall() {
  const localVideoRef = useRef(null);

  const [stream, setStream] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(media);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = media;
        }
      } catch (err) {
        console.error(err);
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  return {
    localVideoRef,
    stream,
  };
}