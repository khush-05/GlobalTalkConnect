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
  const [pendingIceCandidates, setPendingIceCandidates] = useState([]);

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

      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pc.iceConnectionState);
      };

      return pc;
    };

    const initiatePeerConnection = async (targetSocketId) => {
      console.log("Initiating peer connection to:", targetSocketId);
      setRemoteSocketId(targetSocketId);
      
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("webrtc-offer", { 
          to: targetSocketId, 
          offer: offer,
          roomId: roomId 
        });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    };

    // Handle when someone joins the room (only handle this event)
    socket.on("user-joined", async ({ participant, participants }) => {
      console.log("User joined:", participant, "Total participants:", participants.length);
      
      // Only proceed if we have exactly 2 participants
      if (participants.length === 2) {
        const otherParticipant = participants.find(p => p.socketId !== socket.id);
        const currentParticipant = participants.find(p => p.socketId === socket.id);
        
        if (otherParticipant && currentParticipant) {
          // Use socket ID comparison to determine who initiates (more reliable)
          const shouldInitiate = socket.id < otherParticipant.socketId;
          
          if (shouldInitiate) {
            setIsInitiator(true);
            // Add a small delay to ensure both peers are ready
            setTimeout(() => {
              initiatePeerConnection(otherParticipant.socketId);
            }, 1000);
          } else {
            setRemoteSocketId(otherParticipant.socketId);
            setIsInitiator(false);
          }
        }
      }
    });

    // Handle when we first join a room
    socket.on("room-joined", ({ participant, participants }) => {
      console.log("Room joined:", participant, "Existing participants:", participants.length);
      
      // If there's already someone in the room, they will initiate when we trigger "user-joined"
      // We just need to be ready to receive the offer
      if (participants.length === 2) {
        const otherParticipant = participants.find(p => p.socketId !== socket.id);
        if (otherParticipant) {
          const shouldInitiate = socket.id < otherParticipant.socketId;
          setIsInitiator(shouldInitiate);
          
          if (shouldInitiate) {
            // Small delay to ensure the other peer is ready
            setTimeout(() => {
              initiatePeerConnection(otherParticipant.socketId);
            }, 1500);
          } else {
            setRemoteSocketId(otherParticipant.socketId);
          }
        }
      }
    });

    // Handle incoming WebRTC offer
    socket.on("webrtc-offer", async ({ from, offer }) => {
      console.log("Received offer from:", from);
      
      if (peerConnectionRef.current) {
        console.log("Peer connection already exists, closing it");
        peerConnectionRef.current.close();
      }
      
      setRemoteSocketId(from);
      
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc-answer", { 
          to: from, 
          answer: answer,
          roomId: roomId 
        });

        // Process any pending ICE candidates
        if (pendingIceCandidates.length > 0) {
          console.log("Processing pending ICE candidates:", pendingIceCandidates.length);
          for (const candidate of pendingIceCandidates) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
              console.error("Error adding pending ICE candidate:", error);
            }
          }
          setPendingIceCandidates([]);
        }
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    // Handle incoming WebRTC answer
    socket.on("webrtc-answer", async ({ from, answer }) => {
      console.log("Received answer from:", from);
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          
          // Process any pending ICE candidates
          if (pendingIceCandidates.length > 0) {
            console.log("Processing pending ICE candidates after answer:", pendingIceCandidates.length);
            for (const candidate of pendingIceCandidates) {
              try {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (error) {
                console.error("Error adding pending ICE candidate:", error);
              }
            }
            setPendingIceCandidates([]);
          }
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
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
        console.log("Peer connection not ready, storing ICE candidate");
        setPendingIceCandidates(prev => [...prev, candidate]);
      }
    });

    // Handle user leaving
    socket.on("user-left", ({ participantId }) => {
      console.log("User left:", participantId);
      setRemoteStream(null);
      setRemoteSocketId(null);
      setPendingIceCandidates([]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      setConnectionStatus("disconnected");
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
        return !audioTrack.enabled;
      }
    }
    return false;
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return !videoTrack.enabled;
      }
    }
    return false;
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    setRemoteSocketId(null);
    setPendingIceCandidates([]);
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