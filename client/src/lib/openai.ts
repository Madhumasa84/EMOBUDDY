import { ChatMessage, EmotionAnalysis } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Analyze emotion in user message
export async function analyzeEmotion(message: string): Promise<EmotionAnalysis> {
  try {
    const response = await fetch('/api/analyze-emotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to analyze emotion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    // Return a default emotion if analysis fails
    return {
      emotion: 'neutral',
      intensity: 3,
      label: 'Neutral',
      color: '#9CA3AF'
    };
  }
}

// Get AI response to user message
export async function getAIResponse(
  message: string, 
  history: ChatMessage[]
): Promise<{ content: string; emotion: string }> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
      emotion: "neutral"
    };
  }
}

// Check if message contains crisis indicators
export async function detectCrisis(message: string): Promise<boolean> {
  try {
    const response = await fetch('/api/detect-crisis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to detect crisis');
    }

    const data = await response.json();
    return data.isCrisis;
  } catch (error) {
    console.error('Error detecting crisis:', error);
    // Default to false to prevent false positives
    return false;
  }
}
