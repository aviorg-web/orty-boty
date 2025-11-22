import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageSender } from '../types';
import MessageBubble from './MessageBubble';
import Input from './Input';
import Button from './Button';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      await onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-slate-50 relative h-full">
      {/* Chat Area - Increased bottom padding to avoid content being hidden behind input */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-5 space-y-4 pb-28">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex w-full justify-start items-end message-animation">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 flex-shrink-0 ml-2">
              <span className="text-xl md:text-2xl">🤖</span>
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm mb-2 flex items-center h-12">
              {/* Modern Typing Indicator */}
              <div className="flex space-x-1 rtl:space-x-reverse items-center">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-typing"></div>
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-typing [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 bg-purple-400 rounded-full animate-typing [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Floating Pill Design - Lowered position to bottom-0 and minimal padding */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2 bg-white p-2 rounded-full shadow-lg border border-gray-200 ring-1 ring-gray-100">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="כתוב הודעה לבוטי..."
            className="flex-1 bg-transparent border-none focus:ring-0 shadow-none px-4 text-base"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            variant="primary" 
            className={`rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-0 flex-shrink-0 transition-all ${(!input.trim() || isLoading) ? 'opacity-50 grayscale' : 'hover:scale-105'}`}
          >
            {/* Send Icon (SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 -ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;