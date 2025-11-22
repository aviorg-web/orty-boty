
export enum MessageSender {
  STUDENT = 'student',
  BOT = 'bot',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
}

export enum Topic {
  DIRECTED_NUMBERS = 'פעולות במספרים מכוונים',
  ALGEBRAIC_EXPRESSIONS = 'ביטויים אלגבריים',
  SUBSTITUTION = 'הצבה בביטוי אלגברי',
  DISTRIBUTIVE_PROPERTY = 'חוק הפילוג',
  BASIC_ARITHMETIC = 'ארבע פעולות הבסיס בחשבון',
  GEOMETRY_RECTANGLE = 'מלבן וצורות מורכבות (הנדסה)',
}

export interface Exercise {
  id: string;
  topic: Topic;
  question: string;
  answer?: string; // Optional for exercises where bot needs to evaluate
  attempts?: number;
}

export enum AppStage {
  NAME_INPUT,
  TOPIC_SELECTION,
  LEARNING_OPTIONS,
  CHAT_WITH_BOT,
}
