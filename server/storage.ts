import { 
  users, 
  messages, 
  journals, 
  emotionTracking, 
  type User, 
  type InsertUser, 
  type Message, 
  type InsertMessage, 
  type Journal, 
  type InsertJournal, 
  type EmotionTrack, 
  type InsertEmotionTrack 
} from "@shared/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message methods
  getMessagesByUserId(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Journal methods
  getJournalsByUserId(userId: number): Promise<Journal[]>;
  createJournal(journal: InsertJournal): Promise<Journal>;
  
  // Emotion tracking methods
  trackEmotion(emotion: InsertEmotionTrack): Promise<EmotionTrack>;
  getWeeklyEmotions(userId: number): Promise<EmotionTrack[]>;
  getMonthlyEmotions(userId: number): Promise<EmotionTrack[]>;
  getYearlyEmotions(userId: number): Promise<EmotionTrack[]>;
  
  // Session store
  sessionStore: session.Store;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Message methods
  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.userId, userId))
      .orderBy(messages.createdAt);
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  // Journal methods
  async getJournalsByUserId(userId: number): Promise<Journal[]> {
    return await db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt)); // Newest first
  }
  
  async createJournal(insertJournal: InsertJournal): Promise<Journal> {
    const [journal] = await db
      .insert(journals)
      .values(insertJournal)
      .returning();
    return journal;
  }
  
  // Emotion tracking methods
  async trackEmotion(insertEmotion: InsertEmotionTrack): Promise<EmotionTrack> {
    const [emotion] = await db
      .insert(emotionTracking)
      .values(insertEmotion)
      .returning();
    return emotion;
  }
  
  async getWeeklyEmotions(userId: number): Promise<EmotionTrack[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return await db
      .select()
      .from(emotionTracking)
      .where(
        and(
          eq(emotionTracking.userId, userId),
          gte(emotionTracking.date, oneWeekAgo)
        )
      )
      .orderBy(emotionTracking.date);
  }
  
  async getMonthlyEmotions(userId: number): Promise<EmotionTrack[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return await db
      .select()
      .from(emotionTracking)
      .where(
        and(
          eq(emotionTracking.userId, userId),
          gte(emotionTracking.date, oneMonthAgo)
        )
      )
      .orderBy(emotionTracking.date);
  }
  
  async getYearlyEmotions(userId: number): Promise<EmotionTrack[]> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return await db
      .select()
      .from(emotionTracking)
      .where(
        and(
          eq(emotionTracking.userId, userId),
          gte(emotionTracking.date, oneYearAgo)
        )
      )
      .orderBy(emotionTracking.date);
  }
}

export const storage = new DatabaseStorage();
