import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { insertRoomSchema, insertParticipantSchema, insertMessageSchema } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Room management routes
  app.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse({
        id: uuidv4(),
        name: req.body.name || "GlobalTalk Room",
        createdBy: null,
      });
      
      const room = await storage.createRoom(roomData);
      res.json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(400).json({ error: "Failed to create room" });
    }
  });

  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ error: "Failed to fetch room" });
    }
  });

  app.get("/api/rooms/:id/participants", async (req, res) => {
    try {
      const participants = await storage.getParticipantsByRoom(req.params.id);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  app.get("/api/rooms/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessagesByRoom(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);

  // Socket.IO setup for real-time communication
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", async (data: { roomId: string; name: string; language: string }) => {
      try {
        // Check if room exists
        const room = await storage.getRoom(data.roomId);
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Add participant
        const participant = await storage.addParticipant({
          roomId: data.roomId,
          name: data.name,
          language: data.language,
          socketId: socket.id,
        });

        // Join socket room
        socket.join(data.roomId);

        // Get all participants in room
        const participants = await storage.getParticipantsByRoom(data.roomId);

        // Notify others in room
        socket.to(data.roomId).emit("user-joined", {
          participant,
          participants,
        });

        // Send current participants to new user
        socket.emit("room-joined", {
          participant,
          participants,
        });

        console.log(`${data.name} joined room ${data.roomId}`);
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("webrtc-offer", (data: { to: string; offer: any; roomId: string }) => {
      console.log(`WebRTC offer from ${socket.id} to ${data.to} in room ${data.roomId}`);
      socket.to(data.to).emit("webrtc-offer", {
        from: socket.id,
        offer: data.offer,
      });
    });

    socket.on("webrtc-answer", (data: { to: string; answer: any; roomId: string }) => {
      console.log(`WebRTC answer from ${socket.id} to ${data.to} in room ${data.roomId}`);
      socket.to(data.to).emit("webrtc-answer", {
        from: socket.id,
        answer: data.answer,
      });
    });

    socket.on("webrtc-ice-candidate", (data: { to: string; candidate: any; roomId: string }) => {
      console.log(`ICE candidate from ${socket.id} to ${data.to} in room ${data.roomId}`);
      socket.to(data.to).emit("webrtc-ice-candidate", {
        from: socket.id,
        candidate: data.candidate,
      });
    });

    socket.on("send-message", async (data: { roomId: string; content: string }) => {
      try {
        const participant = await storage.getParticipantBySocket(socket.id);
        if (!participant) {
          socket.emit("error", { message: "Participant not found" });
          return;
        }

        const message = await storage.addMessage({
          roomId: data.roomId,
          senderId: participant.id,
          content: data.content,
          translation: null, // TODO: Implement translation
        });

        // Broadcast message to all users in room
        io.to(data.roomId).emit("new-message", {
          ...message,
          senderName: participant.name,
          senderLanguage: participant.language,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", async () => {
      try {
        const participant = await storage.getParticipantBySocket(socket.id);
        if (participant) {
          // Remove participant
          await storage.removeParticipant(participant.id);

          // Notify others in room
          socket.to(participant.roomId!).emit("user-left", {
            participantId: participant.id,
            name: participant.name,
          });

          console.log(`${participant.name} left room ${participant.roomId}`);
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  return httpServer;
}
