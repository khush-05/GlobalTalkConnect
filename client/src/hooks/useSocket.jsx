import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocket(roomId) {
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("room-joined", ({ participant, participants: roomParticipants }) => {
      setParticipants(roomParticipants);
    });

    newSocket.on("user-joined", ({ participant, participants: roomParticipants }) => {
      setParticipants(roomParticipants);
    });

    newSocket.on("user-left", ({ participantId, name }) => {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    });

    newSocket.on("new-message", (message) => {
      setMessages(prev => [...prev, {
        ...message,
        sentAt: new Date(message.sentAt)
      }]);
    });

    newSocket.on("error", ({ message }) => {
      console.error("Socket error:", message);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (content) => {
    if (socket && roomId) {
      socket.emit("send-message", { roomId, content });
    }
  };

  return {
    socket,
    participants,
    messages,
    sendMessage,
  };
}
