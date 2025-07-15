import { Languages } from "lucide-react";

export default function VideoContainer({ 
  videoRef, 
  userName, 
  userLanguage, 
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  hasRemoteStream = false
}) {
  const showPlaceholder = isLocal ? isVideoOff : !hasRemoteStream;

  return (
    <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg h-full">
      {showPlaceholder ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-white text-lg font-medium">{userName}</p>
            <p className="text-gray-400 text-sm">
              {isLocal && isVideoOff 
                ? "Video is off" 
                : !hasRemoteStream 
                ? "Waiting to connect..." 
                : ""
              }
            </p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
        <span>{userName}</span>
        {isLocal && isMuted && (
          <span className="ml-2 text-xs text-gray-300">(Muted)</span>
        )}
        {!isLocal && hasRemoteStream && (
          <span className="ml-2 text-xs text-green-400">Speaking</span>
        )}
      </div>
      
      {userLanguage && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          <Languages className="w-3 h-3 inline mr-1" />
          <span>{userLanguage.toUpperCase()}</span>
        </div>
      )}
      
      {/* Translation Overlay (placeholder for future AI integration) */}
      {!isLocal && hasRemoteStream && (
        <div className="absolute bottom-16 left-4 right-4 bg-black/80 text-white p-3 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
          <div className="text-xs text-gray-300 mb-1">Translation:</div>
          <div className="text-sm">Translation will appear here...</div>
        </div>
      )}
    </div>
  );
}
