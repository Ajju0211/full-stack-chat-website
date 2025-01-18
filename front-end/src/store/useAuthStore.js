import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useVideoStore } from "./useVideoStore.js";
import { useChatStore } from "./useChatStore.js";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  peer: null,
  peerId: null,
  peerList: [],
  IncomingCall: null,
  callerId: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    const  setRemoteStream  = useVideoStore.getState().setRemoteStream;
    const setuserCalling = useChatStore.getState().setuserCalling;
    if (!authUser || get().socket?.connected) return;
    const newPeer = new Peer();
    set({ peer: newPeer });

    
    newPeer.on("open", (id) => {
      set({ peerId: id });
      const { peerId } = get();
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
          peerId: peerId,
        },
      });
      socket.connect();
      set({ socket: socket });

      socket.on('getOnlineUsers', (userIds) => {
        set({ onlineUsers: userIds });
      });

      socket.on('getPeerIds', (users) => {
        set({ peerList: users });
      })
      //If user calls another user It will send Notification
      newPeer.on("call", (call) => {
        set({ ReceivingCall: true });
        set({ IncomingCall: call }); // Store the incoming call
       

        call.on("stream", (stream) => {
          setRemoteStream(stream);
        });0

        call.on("close", () => {
          setuserCalling(false);
          alert("Call ended");
        });
      });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  setRecevingCall: (value) => {
    set({ ReceivingCall: value });
  },
  setIncomingCall: (call) => {
    set({ incomingCall: call });
  }
}));