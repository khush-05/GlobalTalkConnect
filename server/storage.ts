import { rooms, participants, messages, type Room, type Participant, type Message, type InsertRoom, type InsertParticipant, type InsertMessage } from "@shared/schema";

export interface IStorage {
  // Room methods
  createRoom(room: InsertRoom): Promise<Room>;
  getRoom(id: string): Promise<Room | undefined>;
  updateRoomStatus(id: string, isActive: boolean): Promise<void>;
  
  // Participant methods
  addParticipant(participant: InsertParticipant): Promise<Participant>;
  getParticipantsByRoom(roomId: string): Promise<Participant[]>;
  updateParticipantSocket(id: number, socketId: string): Promise<void>;
  removeParticipant(id: number): Promise<void>;
  getParticipantBySocket(socketId: string): Promise<Participant | undefined>;
  
  // Message methods
  addMessage(message: InsertMessage): Promise<Message>;
  getMessagesByRoom(roomId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private rooms: Map<string, Room>;
  private participants: Map<number, Participant>;
  private messages: Map<number, Message>;
  private participantIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.rooms = new Map();
    this.participants = new Map();
    this.messages = new Map();
    this.participantIdCounter = 1;
    this.messageIdCounter = 1;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const room: Room = {
      id: insertRoom.id,
      name: insertRoom.name,
      createdBy: insertRoom.createdBy || null,
      createdAt: new Date(),
      isActive: true,
    };
    this.rooms.set(room.id, room);
    return room;
  }

  async getRoom(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async updateRoomStatus(id: string, isActive: boolean): Promise<void> {
    const room = this.rooms.get(id);
    if (room) {
      room.isActive = isActive;
      this.rooms.set(id, room);
    }
  }

  async addParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const id = this.participantIdCounter++;
    const participant: Participant = {
      id,
      name: insertParticipant.name,
      roomId: insertParticipant.roomId || null,
      language: insertParticipant.language,
      socketId: insertParticipant.socketId || null,
      joinedAt: new Date(),
    };
    this.participants.set(id, participant);
    return participant;
  }

  async getParticipantsByRoom(roomId: string): Promise<Participant[]> {
    return Array.from(this.participants.values()).filter(
      (participant) => participant.roomId === roomId
    );
  }

  async updateParticipantSocket(id: number, socketId: string): Promise<void> {
    const participant = this.participants.get(id);
    if (participant) {
      participant.socketId = socketId;
      this.participants.set(id, participant);
    }
  }

  async removeParticipant(id: number): Promise<void> {
    this.participants.delete(id);
  }

  async getParticipantBySocket(socketId: string): Promise<Participant | undefined> {
    return Array.from(this.participants.values()).find(
      (participant) => participant.socketId === socketId
    );
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const message: Message = {
      id,
      content: insertMessage.content,
      roomId: insertMessage.roomId || null,
      senderId: insertMessage.senderId || null,
      translation: insertMessage.translation || null,
      sentAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.roomId === roomId)
      .sort((a, b) => (a.sentAt?.getTime() || 0) - (b.sentAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();
