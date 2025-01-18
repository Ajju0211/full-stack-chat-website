import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useVideoStore } from "../store/useVideoStore";
import { useChatStore } from "../store/useChatStore";
import { PhoneIncoming, Phone, Bell, AlarmCheck } from "lucide-react";

const CallNotifications = () => {
    const { acceptCall,rejectCall } = useVideoStore();
    const { setRecevingCall } = useAuthStore();
    const { setUserCalling } = useChatStore();

    const handleAcceptCall = () => {
        acceptCall();
        setUserCalling(true);
        setRecevingCall(false);
    };

    const handleRejectCall = () => {
        setRecevingCall(false);
        rejectCall();
    };

    return (
        <div className="absolute   right-4 z-50  flex items-center bg-gray-800 text-white p-4 rounded-xl shadow-lg w-[340px]">
            {/* User Profile */}
            <div className="flex items-center mr-4">
                <Bell size={20} />
            </div>

            {/* Call Info */}
            <div className="flex-1">
                <p className="text-sm text-gray-400">Incoming Call...</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={handleAcceptCall}
                    className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-500 rounded-full shadow-md transition duration-300"
                    aria-label="Accept call"
                >
                <PhoneIncoming className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={handleRejectCall}
                    className="flex items-center justify-center w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full shadow-md transition duration-300"
                    aria-label="Reject call"
                >
                    <Phone className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
};

export default CallNotifications;