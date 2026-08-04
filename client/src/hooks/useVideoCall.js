import { useEffect, useRef, useState } from "react";

export default function useVideoCall() {
  const localVideoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;

      localVideoRef.current.play().catch(console.error);
    }
  }, [stream]);

  const startCamera = async () => {
    if (stream) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      setCameraOn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());

    setStream(null);
    setCameraOn(false);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    if (cameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return {
    localVideoRef,
    stream,
    cameraOn,
    toggleCamera,
    stopCamera,
  };
}