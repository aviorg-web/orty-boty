import React from 'react';
import { ChatMessage, MessageSender } from '../types';
import MathJaxRenderer from './MathJaxRenderer';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isStudent = message.sender === MessageSender.STUDENT;

  // Bot Avatar (Robot)
  const BotAvatar = (
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 flex-shrink-0 ml-2 mt-1">
      <span className="text-xl md:text-2xl" role="img" aria-label="robot">🤖</span>
    </div>
  );

  // Student Avatar (User)
  const StudentAvatar = (
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 flex-shrink-0 mr-2 mt-1">
      <span className="text-xl md:text-2xl" role="img" aria-label="student">🧑‍🎓</span>
    </div>
  );
  
  // Styling
  const containerClasses = isStudent ? 'justify-end' : 'justify-start';
  
  // Added pl-6 to bot bubble to ensure text isn't covered by the RTL scrollbar on the left
  const bubbleClasses = isStudent
    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-none shadow-md max-w-[80%] px-5 py-3'
    : 'bg-white text-gray-800 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 w-full md:max-w-[90%] max-h-[65vh] overflow-y-auto custom-scrollbar px-5 py-4 pl-6'; 

  return (
    <div className={`flex w-full ${containerClasses} mb-4 message-animation group`}>
      {/* Show Avatar only for Bot on the right side (RTL) which is actually left visually in LTR structure, but flex handles it */}
      {!isStudent && BotAvatar}

      <div className={`${bubbleClasses} relative transition-all duration-200 hover:shadow-md`}>
        <MathJaxRenderer content={message.text} />
      </div>

      {/* Show Avatar for Student */}
      {isStudent && StudentAvatar}
    </div>
  );
};

export default MessageBubble;