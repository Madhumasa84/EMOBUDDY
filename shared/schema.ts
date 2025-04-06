import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
  email: text("email"),
  name: text("name"),
  photoUrl: text("photo_url"),
  isGuest: boolean("is_guest").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  isUser: boolean("is_user").default(true).notNull(),
  emotion: text("emotion"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  emotion: text("emotion"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const emotionTracking = pgTable("emotion_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  emotion: text("emotion").notNull(),
  intensity: integer("intensity").notNull(),
  note: text("note"),
  date: timestamp("date").defaultNow().notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});

export const insertJournalSchema = createInsertSchema(journals).omit({
  id: true,
  createdAt: true
});

export const insertEmotionTrackingSchema = createInsertSchema(emotionTracking).omit({
  id: true,
  date: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Journal = typeof journals.$inferSelect;
export type InsertJournal = z.infer<typeof insertJournalSchema>;
export type EmotionTrack = typeof emotionTracking.$inferSelect;
export type InsertEmotionTrack = z.infer<typeof insertEmotionTrackingSchema>;

// Custom type for chat messages
export type ChatMessage = {
  id?: number;
  content: string;
  isUser: boolean;
  emotion?: string;
  createdAt?: Date;
};

// Type for emotion analysis result
export type EmotionAnalysis = {
  emotion: string;
  intensity: number;
  label: string;
  color: string;
};
