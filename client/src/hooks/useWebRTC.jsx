import { useRef, useEffect, useState } from "react";

export function useWebRTC(socket, roomId) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || !localStream) return;

    const createPeerConnection = () => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      // Add local stream to peer connection
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc-ice-candidate", {
            to: roomId,
            candidate: event.candidate,
          });
        }
      };

      return pc;
    };

    // Socket event handlers for WebRTC signaling
    socket.on("webrtc-offer", async ({ from, offer }) => {
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", { to: from, answer });
    });

    socket.on("webrtc-answer", async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    });

    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      }
    });

    socket.on("user-joined", async () => {
      // Create offer for new user
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc-offer", { to: roomId, offer });
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [socket, localStream, roomId]);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socket) {
      socket.disconnect();
    }
  };

  return {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    toggleMute,
    toggleVideo,
    endCall,
  };
}
