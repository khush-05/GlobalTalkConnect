import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Users, PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare } from "lucide-react";
import VideoContainer from "@/components/VideoContainer.jsx";
import ChatPanel from "@/components/ChatPanel.jsx";
import { useWebRTC } from "@/hooks/useWebRTC.jsx";
import { useSocket } from "@/hooks/useSocket.jsx";
import { useToast } from "@/hooks/use-toast";

export default function VideoCall() {
  const { roomId } = useParams();
  const [, setLocation] = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const { toast } = useToast();

  // Get user info from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("name") || "Unknown";
  const userLanguage = urlParams.get("language") || "en";

  const { socket, participants, messages, sendMessage } = useSocket(roomId!);
  const { 
    localVideoRef, 
    remoteVideoRef, 
    localStream,
    remoteStream,
    toggleMute, 
    toggleVideo,
    endCall 
  } = useWebRTC(socket, roomId!);

  useEffect(() => {
    if (!roomId) {
      setLocation("/setup");
      return;
    }

    if (socket) {
      socket.emit("join-room", {
        roomId,
        name: userName,
        language: userLanguage,
      });
    }
  }, [socket, roomId, userName, userLanguage]);

  const handleToggleMute = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoOff(!isVideoOff);
  };

  const handleEndCall = () => {
    endCall();
    setLocation("/");
  };

  const handleSendMessage = (content: string) => {
    if (socket && roomId) {
      sendMessage(content);
    }
  };

  if (!roomId) {
    return null;
  }

  const connectedUsers = participants.length;
  const remoteParticipant = participants.find(p => p.name !== userName);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Globe className="h-6 w-6 text-blue-500 mr-3" />
          <span className="text-white font-semibold">GlobalTalk</span>
          <span className="text-gray-400 ml-4">Room: {roomId}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">Connected: {connectedUsers} users</span>
          </div>
          <div className="flex items-center text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Local Video */}
            <VideoContainer
              videoRef={localVideoRef}
              userName={userName}
              userLanguage={userLanguage}
              isLocal={true}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
            />
            
            {/* Remote Video */}
            <VideoContainer
              videoRef={remoteVideoRef}
              userName={remoteParticipant?.name || "Waiting for participant..."}
              userLanguage={remoteParticipant?.language || ""}
              isLocal={false}
              hasRemoteStream={!!remoteStream}
            />
          </div>
          
          {/* Video Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-2 flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleMute}
              className={`w-12 h-12 rounded-full ${
                isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-full ${
                isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="w-5 h-5 text-white" />
              ) : (
                <Video className="w-5 h-5 text-white" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEndCall}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
        
        {/* Chat Panel */}
        {isChatOpen && (
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={userName}
          />
        )}
      </div>
    </div>
  );
}
