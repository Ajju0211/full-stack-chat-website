import { useChatStore } from "../store/useChatStore";
import { PhoneIncoming, Phone } from "lucide-react";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useAuthStore } from "../store/useAuthStore";
import VideoCallApp from "../components/VideoCall";
import CallNotifications from "../components/CallNotifications";

const HomePage = () => {
  const { selectedUser, userCalling } = useChatStore();
  const { ReceivingCall } = useAuthStore();
  
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {ReceivingCall && <CallNotifications/> }
            {userCalling ? <VideoCallApp /> : !selectedUser ? <NoChatSelected /> : <ChatContainer />
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;