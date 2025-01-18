import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useVideoStore } from "./useVideoStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  userCalling: false,
  selectedUser: null,
  selectedPeerId: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  setUserCalling: (userCalling) => set({ userCalling }),

  setCallingUser: (user) => set({ userCalling: user }),
  callUser: () => {
    set({ userCalling:true });
    const startVideoCall = useVideoStore.getState().startVideoCall;
    startVideoCall();
  },
  getUsers: async () => {
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
      set({ isUsersLoading: true });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
   
    try {
      const peerList  = useAuthStore.getState().peerList;
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      const { selectedUser } = get();
      console.log(selectedUser);
      const reciverPeerId = peerList[selectedUser._id];
      set({ selectedPeerId: reciverPeerId });
    } catch (error) {
      toast.error(error.error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if(socket){
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });} else{
      set({
        message: [...get().messages, "nothing"],
      });
    }
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if(socket){
    socket.off("newMessage");}
  },
  
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setuserCalling: (userCalling) => set({ userCalling }),
}));