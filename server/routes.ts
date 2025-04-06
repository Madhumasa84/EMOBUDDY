import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertMessageSchema, insertJournalSchema, insertEmotionTrackingSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import { generateResponse, analyzeEmotion, detectCrisis } from "./chatbot";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes using Passport
  setupAuth(app);

  // Chat routes
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      
      // Use the open-source chatbot implementation
      const response = generateResponse(message, history);
      
      res.json({ 
        content: response.content, 
        emotion: response.emotion
      });
      
    } catch (error) {
      console.error('Error generating chat response:', error);
      res.status(500).json({ 
        content: "I'm having trouble processing that right now. How else can I support you today?", 
        emotion: "supportive" 
      });
    }
  });

  // Emotion analysis route
  app.post('/api/analyze-emotion', async (req, res) => {
    try {
      const { message } = req.body;
      
      // Use the open-source emotion analysis implementation
      const analysis = analyzeEmotion(message);
      
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      res.status(500).json({ 
        emotion: "neutral", 
        intensity: 3, 
        label: "Neutral", 
        color: "#9CA3AF" 
      });
    }
  });

  // Crisis detection route
  app.post('/api/detect-crisis', async (req, res) => {
    try {
      const { message } = req.body;
      
      // Use the open-source crisis detection implementation
      const isCrisis = detectCrisis(message);
      
      res.json({ isCrisis });
    } catch (error) {
      console.error('Error detecting crisis:', error);
      res.status(500).json({ isCrisis: false });
    }
  });

  // Message routes
  app.get('/api/messages', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const messages = await storage.getMessagesByUserId(parseInt(userId));
      res.json({ messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  app.post('/api/messages', async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const userId = req.body.userId; // Assuming userId is passed in the request
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const message = await storage.createMessage({
        ...messageData,
        userId: parseInt(userId)
      });
      
      res.status(201).json({ message });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Failed to create message' });
    }
  });

  // Journal routes
  app.get('/api/journal', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const journals = await storage.getJournalsByUserId(parseInt(userId));
      res.json({ journals });
    } catch (error) {
      console.error('Error fetching journals:', error);
      res.status(500).json({ message: 'Failed to fetch journals' });
    }
  });

  app.post('/api/journal', async (req, res) => {
    try {
      const journalData = insertJournalSchema.parse(req.body);
      const userId = req.body.userId; // Assuming userId is passed in the request
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      // Analyze emotion in journal content using open-source implementation
      const emotionResult = analyzeEmotion(journalData.content);
      const emotion = emotionResult.emotion;
      
      const journal = await storage.createJournal({
        ...journalData,
        userId: parseInt(userId),
        emotion
      });
      
      res.status(201).json({ journal });
    } catch (error) {
      console.error('Error creating journal:', error);
      res.status(500).json({ message: 'Failed to create journal' });
    }
  });

  // Journal prompt routes
  app.get('/api/journal/prompt', async (req, res) => {
    try {
      // Generate a random journal prompt
      const prompts = [
        {
          id: "work-stress",
          title: "Work Stress Reflection",
          description: "What specific aspects of work are causing you stress, and what small changes might help reduce that pressure?"
        },
        {
          id: "gratitude",
          title: "Gratitude Journey",
          description: "List three things you're grateful for today and explain why they bring you joy."
        },
        {
          id: "self-care",
          title: "Self-Care Inventory",
          description: "What self-care activities have you been neglecting lately, and how can you prioritize them?"
        },
        {
          id: "emotional-triggers",
          title: "Emotional Triggers",
          description: "Reflect on a recent strong emotional reaction. What triggered it and what might it tell you about yourself?"
        }
      ];
      
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      res.json({ prompt: randomPrompt });
    } catch (error) {
      console.error('Error generating journal prompt:', error);
      res.status(500).json({ message: 'Failed to generate journal prompt' });
    }
  });

  app.get('/api/journal/prompt/:id', async (req, res) => {
    try {
      const promptId = req.params.id;
      
      // Predefined prompts
      const prompts = {
        "work-stress": {
          id: "work-stress",
          title: "Work Stress Reflection",
          description: "What specific aspects of work are causing you stress, and what small changes might help reduce that pressure?"
        },
        "gratitude": {
          id: "gratitude",
          title: "Gratitude Journey",
          description: "List three things you're grateful for today and explain why they bring you joy."
        },
        "self-care": {
          id: "self-care",
          title: "Self-Care Inventory",
          description: "What self-care activities have you been neglecting lately, and how can you prioritize them?"
        },
        "emotional-triggers": {
          id: "emotional-triggers",
          title: "Emotional Triggers",
          description: "Reflect on a recent strong emotional reaction. What triggered it and what might it tell you about yourself?"
        }
      };
      
      const prompt = prompts[promptId as keyof typeof prompts];
      
      if (!prompt) {
        return res.status(404).json({ message: 'Prompt not found' });
      }
      
      res.json({ prompt });
    } catch (error) {
      console.error('Error fetching journal prompt:', error);
      res.status(500).json({ message: 'Failed to fetch journal prompt' });
    }
  });

  // Emotion tracking routes
  app.get('/api/emotions/weekly', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const emotions = await storage.getWeeklyEmotions(parseInt(userId));
      res.json({ emotions });
    } catch (error) {
      console.error('Error fetching weekly emotions:', error);
      res.status(500).json({ message: 'Failed to fetch weekly emotions' });
    }
  });

  app.post('/api/emotions/track', async (req, res) => {
    try {
      const emotionData = insertEmotionTrackingSchema.parse(req.body);
      const userId = req.body.userId; // Assuming userId is passed in the request
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const emotion = await storage.trackEmotion({
        ...emotionData,
        userId: parseInt(userId)
      });
      
      res.status(201).json({ emotion });
    } catch (error) {
      console.error('Error tracking emotion:', error);
      res.status(500).json({ message: 'Failed to track emotion' });
    }
  });

  app.get('/api/emotions/report', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const range = req.query.range as string || 'week';
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      let emotions;
      if (range === 'week') {
        emotions = await storage.getWeeklyEmotions(parseInt(userId));
      } else if (range === 'month') {
        emotions = await storage.getMonthlyEmotions(parseInt(userId));
      } else {
        emotions = await storage.getYearlyEmotions(parseInt(userId));
      }
      
      res.json({ emotions });
    } catch (error) {
      console.error('Error fetching emotion report:', error);
      res.status(500).json({ message: 'Failed to fetch emotion report' });
    }
  });

  // User profile routes
  app.put('/api/user/profile', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { username, email, userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      // Validate data
      if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'Username is required' });
      }
      
      // Update user in storage
      const updatedUser = await storage.updateUser(parseInt(userId), {
        username,
        email: email || ''
      });
      
      res.json({ user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });
  
  // Resources routes
  app.get('/api/resources', async (req, res) => {
    try {
      const category = req.query.category as string || 'all';
      
      // Predefined resources
      const resources = [
        {
          id: "stress-management",
          title: "Stress Management Techniques",
          description: "Learn practical strategies for daily stress",
          content: "Practicing mindfulness, deep breathing exercises, and regular physical activity can help reduce stress levels. Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds.",
          category: "stress",
          icon: "ri-mental-health-line"
        },
        {
          id: "sleep-improvement",
          title: "Sleep Improvement Guide",
          description: "Tips for better sleep quality",
          content: "Establish a regular sleep schedule, create a restful environment, limit exposure to screens before bedtime, and avoid caffeine and alcohol close to bedtime. Consider trying relaxation techniques like progressive muscle relaxation before sleep.",
          category: "sleep",
          icon: "ri-sleep-line"
        },
        {
          id: "crisis-hotlines",
          title: "Crisis Support Hotlines",
          description: "24/7 emergency mental health resources",
          content: "National Suicide Prevention Lifeline: 1-800-273-8255\nCrisis Text Line: Text HOME to 741741\nVeterans Crisis Line: 1-800-273-8255 (Press 1)\nLGBTQ+ Youth: The Trevor Project at 1-866-488-7386",
          category: "crisis",
          icon: "ri-heart-pulse-line"
        },
        {
          id: "mindfulness-meditation",
          title: "Mindfulness Meditation Guide",
          description: "Simple meditation techniques for beginners",
          content: "Start with just 5 minutes a day of focused breathing. Find a quiet place, sit comfortably, and focus on your breath. When your mind wanders, gently bring your attention back to your breathing. Gradually increase your meditation time as you become more comfortable with the practice.",
          category: "mental",
          icon: "ri-sun-line"
        },
        {
          id: "anxiety-coping",
          title: "Anxiety Coping Strategies",
          description: "Practical ways to manage anxiety symptoms",
          content: "Practice the 5-4-3-2-1 grounding technique: Acknowledge 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste. This helps bring you back to the present moment when anxiety feels overwhelming.",
          category: "anxiety",
          icon: "ri-psychotherapy-line"
        }
      ];
      
      const filteredResources = category === 'all' 
        ? resources 
        : resources.filter(resource => resource.category === category);
      
      res.json({ resources: filteredResources });
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ message: 'Failed to fetch resources' });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
