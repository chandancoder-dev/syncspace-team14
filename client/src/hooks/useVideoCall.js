import { useEffect, useRef, useState } from "react";

export default function useVideoCall() {
  const localVideoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  // Attach stream to video element whenever stream changes
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;

      localVideoRef.current.play().catch((err) => {
        console.error("Video play error:", err);
      });
    }
  }, [stream]);

  // Start camera and microphone
  const startCamera = async () => {
    if (stream) return;

    try {
      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setStream(mediaStream);
      setCameraOn(true);
    } catch (err) {
      console.error("Camera permission error:", err);
    }
  };

  // Stop camera and microphone
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setStream(null);
    setCameraOn(false);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (cameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    localVideoRef,
    stream,
    cameraOn,
    toggleCamera,
    stopCamera,
  };
}