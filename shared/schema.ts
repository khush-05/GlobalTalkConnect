import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const rooms = pgTable("rooms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  roomId: text("room_id").references(() => rooms.id),
  name: text("name").notNull(),
  language: text("language").notNull(),
  socketId: text("socket_id"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  roomId: text("room_id").references(() => rooms.id),
  senderId: integer("sender_id").references(() => participants.id),
  content: text("content").notNull(),
  translation: text("translation"),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  createdAt: true,
  isActive: true,
});

export const insertParticipantSchema = createInsertSchema(participants).omit({
  id: true,
  joinedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
});

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Room = typeof rooms.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type Message = typeof messages.$inferSelect;
