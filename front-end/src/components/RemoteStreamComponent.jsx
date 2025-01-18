import React, { useEffect, useRef } from "react";
import { useVideoStore } from "../store/useVideoStore";

const RemoteStreamComponent = () => {
  const remoteStream = useVideoStore((state) => state.remoteStream);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return <video ref={remoteVideoRef} autoPlay className="realtive" />;
};

export default RemoteStreamComponent;
