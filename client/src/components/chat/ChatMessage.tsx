import { ChatMessage as ChatMessageType } from "@shared/schema";

// Map emotions to colors
const emotionColors: Record<string, string> = {
  happy: "#FCD34D",
  sad: "#93C5FD",
  angry: "#F87171",
  anxious: "#A78BFA",
  neutral: "#9CA3AF",
  calm: "#6EE7B7",
  empathetic: "#A78BFA",
  supportive: "#6EE7B7",
  compassionate: "#93C5FD"
};

// Map emotions to labels
const emotionLabels: Record<string, string> = {
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  anxious: "Anxious",
  neutral: "Neutral",
  calm: "Calm",
  empathetic: "Empathetic",
  supportive: "Supportive",
  compassionate: "Compassionate"
};

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { content, isUser, emotion } = message;
  
  // Get emotion color and label
  const emotionColor = emotion && emotionColors[emotion] ? emotionColors[emotion] : "#9CA3AF";
  const emotionLabel = emotion && emotionLabels[emotion] ? emotionLabels[emotion] : "Neutral";
  
  // Helper function to render list items in bot responses
  const renderContent = (text: string) => {
    // Check if the content has numbered list items
    if (text.includes("\n1. ")) {
      const parts = text.split(/(\n\d+\. )/);
      return (
        <>
          {parts.map((part, index) => {
            if (part.match(/\n\d+\. /)) {
              // This is a list item marker
              return null;
            } else if (index > 0 && parts[index - 1].match(/\n\d+\. /)) {
              // This is list item content
              return <li key={index}>{part}</li>;
            } else {
              // Regular text
              return <p key={index}>{part}</p>;
            }
          })}
        </>
      );
    }
    
    // Regular text with paragraph breaks
    return text.split("\n").map((line, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
    ));
  };

  return (
    <div className={`chat-bubble ${isUser ? "user" : "bot"}`}>
      {!isUser && (
        <div className="flex items-center mb-1">
          <span className="emotion-indicator" style={{ backgroundColor: emotionColor }}></span>
          <span className="text-xs text-neutral-500">
            EmoBuddy{emotion ? ` • ${emotionLabel}` : ""}
          </span>
        </div>
      )}
      
      {isUser ? (
        <p>{content}</p>
      ) : (
        <div>
          {content.includes("\n1. ") ? (
            <>
              <p>{content.split("\n1. ")[0]}</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                {renderContent(content)}
              </ol>
            </>
          ) : (
            renderContent(content)
          )}
        </div>
      )}
    </div>
  );
}
