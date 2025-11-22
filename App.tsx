import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, MessageSender, Topic, Exercise, AppStage } from './types';
import { initializeChat, sendChatMessage } from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import Input from './components/Input';
import Button from './components/Button';
import TopicSelector from './components/TopicSelector';
import LearningOptionsComponent from './components/LearningOptions';
import { TOPICS } from './constants';

function App() {
  const [studentName, setStudentName] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatReady, setChatReady] = useState<boolean>(false);
  const [appStage, setAppStage] = useState<AppStage>(AppStage.NAME_INPUT);
  
  const hasGreetingRun = useRef(false);
  const chatInitializedRef = useRef(false);

  const addMessage = useCallback((sender: MessageSender, text: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now().toString() + Math.random().toString(36).substring(7), sender, text },
    ]);
  }, []);

  useEffect(() => {
    if (!hasGreetingRun.current) {
      addMessage(
        MessageSender.BOT,
        'שלום! אני בוטי המתמטי, המורה הפרטי שלך למתמטיקה. איך קוראים לך?',
      );
      hasGreetingRun.current = true;
    }
  }, [addMessage]);

  useEffect(() => {
    const setupChat = async () => {
      if (studentName && !chatReady && !chatInitializedRef.current) {
        chatInitializedRef.current = true;
        setIsLoading(true);
        try {
          await initializeChat(studentName);
          setChatReady(true);
          const initialBotResponse = await sendChatMessage({
            id: 'init_chat_' + Date.now(),
            sender: MessageSender.STUDENT,
            text: `שמי ${studentName}.`,
          });
          addMessage(MessageSender.BOT, initialBotResponse);
          setAppStage(AppStage.TOPIC_SELECTION);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to initialize chat:', error);
          addMessage(
            MessageSender.BOT,
            'אופס! נראה שיש בעיה בחיבור. אנא נסה/נסי שוב מאוחר יותר.',
          );
          setIsLoading(false);
          chatInitializedRef.current = false; 
        }
      }
    };
    setupChat();
  }, [studentName, addMessage, chatReady]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      addMessage(MessageSender.STUDENT, inputName.trim());
      setStudentName(inputName.trim());
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    addMessage(MessageSender.STUDENT, text);
    setIsLoading(true);
    try {
      const botResponseText = await sendChatMessage({
        id: Date.now().toString(),
        sender: MessageSender.STUDENT,
        text: text,
      });
      addMessage(MessageSender.BOT, botResponseText);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage(
        MessageSender.BOT,
        'אופס! הייתה בעיה עם התקשורת. אנא נסה/נסי שוב.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const handleSelectTopic = useCallback(async (topic: Topic) => {
    setCurrentTopic(topic);
    addMessage(MessageSender.STUDENT, `בחרתי בנושא: ${topic}`);
    setAppStage(AppStage.LEARNING_OPTIONS);
  }, [addMessage]);

  const handleSelectLearningOption = useCallback(async (option: 'theory' | 'exercises') => {
    if (!currentTopic) return;

    setAppStage(AppStage.CHAT_WITH_BOT);
    setIsLoading(true);

    let uiMessage = '';
    let apiPrompt = '';

    if (option === 'theory') {
      // UI: What the student sees (Natural)
      uiMessage = `אשמח להסבר תיאורטי בנושא ${currentTopic}.`;
      // API: What the bot hears (Instructional)
      apiPrompt = `אני רוצה הסבר תיאורטי מלא בבקשה בנושא ${currentTopic}. שים לב: אל תיתן לי עדיין תרגילים! רק תסביר, ובסיום ההסבר שאל אותי אם הבנתי ואני מוכן לתרגול.`;
    } else {
      uiMessage = `אני רוצה לעבור ישר לתרגילים בנושא ${currentTopic}.`;
      apiPrompt = `אני רוצה לתרגל את הנושא ${currentTopic}. תן לי תרגיל אחד לפתור. הקפד לנסח שאלה ברורה (למשל: "חשב את השטח").`;
    }

    addMessage(MessageSender.STUDENT, uiMessage);
    
    try {
      const botResponseText = await sendChatMessage({
        id: Date.now().toString(),
        sender: MessageSender.STUDENT,
        text: apiPrompt,
      });
      addMessage(MessageSender.BOT, botResponseText);
    } catch (error) {
      console.error('Error selecting learning option:', error);
      addMessage(
        MessageSender.BOT,
        'אופס! הייתה בעיה בבחירת אפשרות הלמידה. אנא נסה/נסי שוב.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, currentTopic]);

  const handleGoHome = useCallback(() => {
    setCurrentTopic(null);
    setAppStage(AppStage.TOPIC_SELECTION);
  }, []);

  const handleMoveToPractice = useCallback(() => {
    const uiMessage = "אני רוצה לעבור לתרגול עכשיו.";
    const apiPrompt = "ההסבר היה ברור. אני רוצה לעבור לתרגול עכשיו. תן לי תרגיל (וקודם הצג את השאלה בבירור).";
    
    addMessage(MessageSender.STUDENT, uiMessage);
    
    setIsLoading(true);
    sendChatMessage({
        id: Date.now().toString(),
        sender: MessageSender.STUDENT,
        text: apiPrompt,
    }).then(response => {
        addMessage(MessageSender.BOT, response);
    }).catch(err => {
        console.error(err);
         addMessage(MessageSender.BOT, 'אופס! הייתה בעיה.');
    }).finally(() => {
        setIsLoading(false);
    });

  }, [addMessage]);

  const handleConsultation = useCallback(() => {
    if (appStage !== AppStage.CHAT_WITH_BOT) {
      setAppStage(AppStage.CHAT_WITH_BOT);
    }
    handleSendMessage("אשמח להתייעץ איתך ולקבל רמז או עזרה בנושא מתמטי.");
  }, [appStage, handleSendMessage]);

  if (appStage === AppStage.NAME_INPUT) {
    return (
      <div className="flex flex-col items-center justify-center p-6 w-full h-full relative">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/50 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
            ברוכים הבאים ל<br/><span className="text-blue-600">בוטי המתמטי</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-medium">
            המלווה הלימודי שלך למתמטיקה בכיתה ז'
          </p>
          <form onSubmit={handleNameSubmit} className="flex flex-col items-center w-full">
            <Input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="הכנס/י את שמך כאן..."
              className="mb-4 text-center text-lg bg-gray-50 border-gray-200 focus:bg-white rounded-full py-4"
              dir="rtl"
              required
              autoFocus
            />
            <Button type="submit" variant="primary" className="w-full text-xl py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              בוא נתחיל! 🚀
            </Button>
          </form>
        </div>
        <div className="absolute bottom-4 text-[10px] text-gray-500 font-[Arial]">
          נבנה ע"י אבי שוורץ אורט פרס יקנעם
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md text-gray-800 p-3 md:p-4 flex flex-wrap items-center justify-between gap-2 shadow-sm border-b border-gray-100 flex-shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="text-xl md:text-2xl font-black text-blue-600 tracking-tight">בוטי המתמטי</span>
          {isLoading && (
             <div className="flex space-x-1 rtl:space-x-reverse items-center">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-typing"></div>
                <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-typing [animation-delay:0.2s]"></div>
                <div className="h-1.5 w-1.5 bg-purple-400 rounded-full animate-typing [animation-delay:0.4s]"></div>
              </div>
          )}
        </div>
        <div className="flex gap-2 items-center flex-wrap justify-end flex-1">
           <button
            onClick={handleConsultation}
            disabled={isLoading}
            className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-sm font-bold transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1 border border-amber-200"
          >
            <span>💡</span> התייעצות
          </button>

          {appStage === AppStage.CHAT_WITH_BOT && (
            <button
              onClick={handleMoveToPractice}
              disabled={isLoading}
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-sm font-bold transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1 border border-blue-100"
            >
              <span>✏️</span> לתרגול
            </button>
          )}
          {appStage !== AppStage.NAME_INPUT && appStage !== AppStage.TOPIC_SELECTION && (
            <button 
              onClick={handleGoHome} 
              className="text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              בית
            </button>
          )}
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar */}
        <aside className="hidden md:flex w-full md:w-1/4 lg:w-1/5 bg-gray-50/50 p-4 border-l border-gray-100 overflow-y-auto custom-scrollbar flex-col items-center flex-shrink-0 z-10 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-4 w-full text-center text-xs">נושאי לימוד</h3>
          <ul className="w-full space-y-3">
            {TOPICS.map((topic) => (
              <li key={topic}>
                <Button
                  variant={currentTopic === topic ? 'primary' : 'outline'}
                  onClick={() => handleSelectTopic(topic)}
                  className={`w-full text-sm px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${currentTopic === topic ? 'shadow-blue-200 shadow-lg translate-x-[-2px]' : 'bg-white border-transparent shadow-sm hover:shadow-md hover:border-blue-200'}`}
                  disabled={isLoading || appStage === AppStage.LEARNING_OPTIONS || (appStage === AppStage.CHAT_WITH_BOT && currentTopic !== topic)}
                >
                  <span className="text-right truncate">{topic}</span>
                  {currentTopic === topic && <span className="text-xs opacity-70">✅</span>}
                </Button>
              </li>
            ))}
          </ul>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative w-full bg-white/50">
          {appStage === AppStage.TOPIC_SELECTION ? (
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-slate-50">
              <TopicSelector onSelectTopic={handleSelectTopic} />
            </div>
          ) : appStage === AppStage.LEARNING_OPTIONS && currentTopic ? (
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-slate-50">
              <LearningOptionsComponent currentTopic={currentTopic} onSelectOption={handleSelectLearningOption} isLoading={isLoading} />
            </div>
          ) : (
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
          )}
        </main>
      </div>
      
      {/* Footer Credit */}
      <div className="w-full text-center md:text-right px-4 py-1 text-[10px] text-gray-400/80 bg-white/80 border-t border-gray-100 flex-shrink-0 backdrop-blur-sm">
        נבנה ע"י אבי שוורץ אורט פרס יקנעם
      </div>
    </div>
  );
}

export default App;