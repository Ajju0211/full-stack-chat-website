import React from "react";
import LocalStreamComponent from "./LocalStreamComponent";
import RemoteStreamComponent from "./RemoteStreamComponent";
import { useVideoStore } from "../store/useVideoStore";

const VideoCallPage = () => {
  const { hungUp } = useVideoStore();
  const handleHungUp = () => {
    hungUp();
  }
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-6 p-4">
      <h1 className="text-2xl font-semibold mb-6">Video Call</h1>

      {/* Video Streams Section (Mobile Stack, Desktop Side by Side) */}
      <div className="flex flex-col sm:flex-row justify-center w-full gap-6 mb-6">
        {/* Remote Stream */}
        <div className="relative sm:w-1/2 w-full max-w-lg aspect-w-16 aspect-h-9">
          <h2 className="absolute top-2 left-2 text-white font-bold text-lg">Other User...</h2>
          <RemoteStreamComponent className="w-full h-full rounded-lg shadow-lg object-cover" />
        </div>

        {/* Local Stream */}
        <div className="relative sm:w-1/2 w-full max-w-lg aspect-w-16 aspect-h-9">
          <p className="absolute top-2 left-2 text-white font-bold text-lg">You</p>
          <LocalStreamComponent className="w-full h-full rounded-lg shadow-lg object-cover" />
        </div>
      </div>

      {/* Hang Up Button */}
      <button onClick={() => handleHungUp()} className="btn px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
        Hang Up
      </button>
    </div>
  );
};

export default VideoCallPage;
