import { useRef, useEffect } from "react";
import { useChat } from "../../context/ChatContext";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatSection() {
  const { messages, isTyping, sendMessage } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="bg-white rounded-xl shadow-card h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <i className="ri-robot-line text-primary-500"></i>
          </div>
          <div>
            <h2 className="font-medium text-neutral-800">EmoBuddy</h2>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-xs text-neutral-500">Online, ready to chat</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100">
          <i className="ri-information-line"></i>
        </button>
      </div>
      
      <div 
        id="chatContainer" 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-neutral-50"
      >
        {/* Date separator */}
        <div className="flex items-center justify-center my-4">
          <span className="text-xs bg-neutral-200 text-neutral-500 rounded-full px-3 py-1">
            Today
          </span>
        </div>
        
        {/* Chat messages */}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble bot w-24">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
