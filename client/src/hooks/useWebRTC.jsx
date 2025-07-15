import { useRef, useEffect, useState } from "react";

export function useWebRTC(socket, roomId) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

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
        console.log("Received remote stream:", event.streams);
        const [stream] = event.streams;
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && remoteSocketId) {
          console.log("Sending ICE candidate to:", remoteSocketId);
          socket.emit("webrtc-ice-candidate", {
            to: remoteSocketId,
            candidate: event.candidate,
            roomId: roomId,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
        setConnectionStatus(pc.connectionState);
      };

      return pc;
    };

    // Handle when someone joins the room
    socket.on("user-joined", async ({ participant, participants }) => {
      console.log("User joined:", participant, "Total participants:", participants.length);
      
      // If there are exactly 2 participants, check if we should initiate
      if (participants.length === 2) {
        const otherParticipant = participants.find(p => p.socketId !== socket.id);
        const currentParticipant = participants.find(p => p.socketId === socket.id);
        
        if (otherParticipant && currentParticipant) {
          setRemoteSocketId(otherParticipant.socketId);
          
          // The participant who joined first (lower ID) initiates the call
          const shouldInitiate = currentParticipant.id < otherParticipant.id;
          
          if (shouldInitiate) {
            setIsInitiator(true);
            console.log("Initiating call to:", otherParticipant.socketId);
            
            const pc = createPeerConnection();
            peerConnectionRef.current = pc;

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("webrtc-offer", { 
              to: otherParticipant.socketId, 
              offer: offer,
              roomId: roomId 
            });
          }
        }
      }
    });

    // Handle when we join a room
    socket.on("room-joined", ({ participant, participants }) => {
      console.log("Room joined:", participant, "Existing participants:", participants.length);
      
      // If there are already 2 participants when we join, set up for connection
      if (participants.length === 2) {
        const otherParticipant = participants.find(p => p.socketId !== socket.id);
        if (otherParticipant) {
          setRemoteSocketId(otherParticipant.socketId);
          
          // The participant who joined first (lower ID) will initiate
          const shouldInitiate = participant.id < otherParticipant.id;
          setIsInitiator(shouldInitiate);
          
          if (shouldInitiate) {
            console.log("Starting call as initiator to:", otherParticipant.socketId);
            setTimeout(async () => {
              const pc = createPeerConnection();
              peerConnectionRef.current = pc;

              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);

              socket.emit("webrtc-offer", { 
                to: otherParticipant.socketId, 
                offer: offer,
                roomId: roomId 
              });
            }, 1000); // Small delay to ensure both sides are ready
          }
        }
      }
    });

    // Handle incoming WebRTC offer
    socket.on("webrtc-offer", async ({ from, offer }) => {
      console.log("Received offer from:", from);
      setRemoteSocketId(from);
      
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", { 
        to: from, 
        answer: answer,
        roomId: roomId 
      });
    });

    // Handle incoming WebRTC answer
    socket.on("webrtc-answer", async ({ from, answer }) => {
      console.log("Received answer from:", from);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Handle incoming ICE candidates
    socket.on("webrtc-ice-candidate", async ({ from, candidate }) => {
      console.log("Received ICE candidate from:", from);
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("ICE candidate added successfully");
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      } else {
        console.log("Peer connection not ready for ICE candidate");
      }
    });

    // Handle user leaving
    socket.on("user-left", ({ participantId }) => {
      console.log("User left:", participantId);
      setRemoteStream(null);
      setRemoteSocketId(null);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [socket, localStream, roomId, remoteSocketId]);

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
    connectionStatus,
    toggleMute,
    toggleVideo,
    endCall,
  };
}
