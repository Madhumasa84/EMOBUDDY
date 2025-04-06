import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { ChatMessage } from "@shared/schema";
import { useAuth } from "../context/AuthContext";

interface ChatContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  showCrisisAlert: boolean;
  setShowCrisisAlert: (show: boolean) => void;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  isTyping: false,
  sendMessage: async () => {},
  showCrisisAlert: false,
  setShowCrisisAlert: () => {},
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const { user } = useAuth();

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        content: "Hi there! I'm EmoBuddy, your AI emotional support companion. How are you feeling today?",
        isUser: false,
        emotion: "calm",
        createdAt: new Date(),
      },
    ]);
    
    // Fetch conversation history if user is logged in
    if (user && user.id) {
      fetch(`/api/messages?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message to state
    const userMessage: ChatMessage = {
      id: Date.now(), // Temporary ID for client-side
      content,
      isUser: true,
      createdAt: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Start typing indicator
    setIsTyping(true);
    
    try {
      // Save user message to database if user is logged in
      if (user && user.id) {
        try {
          await fetch('/api/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: userMessage.content,
              isUser: true,
              userId: user.id
            }),
            credentials: 'include',
          });
        } catch (error) {
          console.error('Error saving user message:', error);
        }
      }
      
      // Check for crisis indicators
      try {
        const crisisResponse = await fetch('/api/detect-crisis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: content }),
          credentials: 'include',
        });
        
        if (crisisResponse.ok) {
          const crisisData = await crisisResponse.json();
          if (crisisData.isCrisis) {
            setShowCrisisAlert(true);
          }
        }
      } catch (error) {
        console.error('Error detecting crisis:', error);
      }
      
      // Get AI response
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-5) // Send last 5 messages for context
        }),
        credentials: 'include',
      });
      
      if (!chatResponse.ok) {
        throw new Error('Failed to get chat response');
      }
      
      const response = await chatResponse.json();
      
      // Add AI response to state
      const botMessage: ChatMessage = {
        id: Date.now() + 1, // Temporary ID for client-side
        content: response.content,
        isUser: false,
        emotion: response.emotion,
        createdAt: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Save bot message to database if user is logged in
      if (user && user.id) {
        try {
          await fetch('/api/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: botMessage.content,
              isUser: false,
              emotion: botMessage.emotion,
              userId: user.id
            }),
            credentials: 'include',
          });
        } catch (error) {
          console.error('Error saving bot message:', error);
        }
      }
    } catch (error) {
      console.error('Error in chat process:', error);
      
      // Add error message if something goes wrong
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2, // Temporary ID for client-side
          content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
          isUser: false,
          emotion: "neutral",
          createdAt: new Date(),
        },
      ]);
    } finally {
      // Stop typing indicator
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        isTyping, 
        sendMessage, 
        showCrisisAlert, 
        setShowCrisisAlert 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
