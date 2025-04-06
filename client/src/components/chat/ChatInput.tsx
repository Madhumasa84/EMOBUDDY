import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSendMessage(message);
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-neutral-100 p-3 bg-white">
      <div className="flex items-end gap-2">
        <button className="p-2 text-neutral-400 hover:text-primary-500 rounded-full hover:bg-neutral-100">
          <i className="ri-emotion-line text-xl"></i>
        </button>
        <div className="flex-1 bg-neutral-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-300 focus-within:bg-white">
          <textarea 
            ref={textareaRef}
            rows={1} 
            placeholder="Type your message..." 
            className="w-full bg-transparent focus:outline-none resize-none text-neutral-800 placeholder-neutral-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
        </div>
        <button 
          className={`p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSendMessage}
          disabled={isSubmitting}
        >
          <i className="ri-send-plane-fill"></i>
        </button>
      </div>
      <div className="flex items-center justify-between px-2 mt-2">
        <div className="flex text-xs text-neutral-400">
          <span>Your messages are encrypted and secure</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 text-neutral-400 hover:text-neutral-600">
            <i className="ri-image-line"></i>
          </button>
          <button className="p-1 text-neutral-400 hover:text-neutral-600">
            <i className="ri-attachment-2"></i>
          </button>
          <button className="p-1 text-neutral-400 hover:text-neutral-600">
            <i className="ri-mic-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
