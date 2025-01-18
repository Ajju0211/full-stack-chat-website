import React, { useEffect, useRef } from "react";
import { useVideoStore } from "../store/useVideoStore";

const LocalStreamComponent = () => {
  const localStream = useVideoStore((state) => state.localStream);
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return <video ref={localVideoRef} autoPlay className="realtive"  />;
};

export default LocalStreamComponent;
