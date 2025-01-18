import { create } from "zustand";
import { useChatStore } from "./useChatStore";
import { useAuthStore } from "./useAuthStore";

export const useVideoStore = create((set, get) => ({
  isVideoCalling: false,
  caller: null,
  localStream: null,
  remoteStream: null,
  peerId: null,

  startVideoCall: async () => {
    const peer = useAuthStore.getState().peer;
    const selectedPeerId = useChatStore.getState().selectedPeerId;

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).catch((error) => {
      if (error.name === "NotAllowedError") {
        alert("Please allow access to the camera and microphone.");
      } else {
        console.error("Error accessing media devices:", error);
      }
    });
    if (!mediaStream) return; // Exit if denied

    set({ localStream: mediaStream });

    if (!selectedPeerId) return alert("User is Offline");

    const call = peer.call(selectedPeerId, mediaStream);

    call.on("stream", (stream) => {
      set({ remoteStream: stream });
    });

    call.on("close", () => {
    const setuserCalling = useChatStore.getState().setuserCalling;
    if(mediaStream){
        mediaStream.getTracks().forEach(track => {

            track.stop();  // This will stop both video and audio
            setuserCalling(false)
          });
          mediaStream.stop();
        
    }
      
    });
  },

  acceptCall: async () => {
    const IncomingCall = useAuthStore.getState().IncomingCall;
    const setIncomingCall = useAuthStore.getState().setIncomingCall;

    let localStream = get().localStream;
    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).catch((error) => {
        if (error.name === "NotAllowedError") {
          alert("Please allow access to the camera and microphone.");
        } else {
          console.error("Error accessing media devices:", error);
        }
      });
      if (!localStream) return;
      set({ localStream });
    }

    const call = IncomingCall;
    call.answer(localStream);

    call.on("stream", (stream) => {
      set({ remoteStream: stream });
    });

    call.on("close", () => {
      console.log("Call ended");
      setIncomingCall(false);
    });
  },

  rejectCall: () => {
    call.close(); // End the call locally

    // Notify the caller that the call was rejected
    connection.send({ type: "call-rejected" });
    set({ caller: null, IncomingCall: null });
  },

  hungUp: () => {
    const setuserCalling = useChatStore.getState().setuserCalling;
    const IncomingCall = useAuthStore.getState().IncomingCall;
   
    const localStream = get().localStream;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setuserCalling(false);
      if(IncomingCall){
      IncomingCall.close();}
    }
    set({ remoteStream: null, caller: null, IncomingCall: null });

  },

  setRemoteStream: (stream) => {
    set({ remoteStream: stream });
  },
}));
