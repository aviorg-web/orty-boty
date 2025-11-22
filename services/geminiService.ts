import { GoogleGenAI, Chat, GenerateContentResponse, ChatMessage as GenAIChatMessage } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { ChatMessage, MessageSender } from '../types';

let chatInstance: Chat | null = null;

export const initializeChat = async (studentName: string): Promise<void> => {
  if (process.env.API_KEY === undefined || process.env.API_KEY === "") {
    console.error("API_KEY environment variable is not set.");
    alert("API Key is missing. Please ensure it's configured correctly.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chatInstance = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
    },
  });

  console.log("Gemini chat initialized.");
};

export const sendChatMessage = async (
  message: ChatMessage
): Promise<string> => {
  if (!chatInstance) {
    throw new Error("Chat not initialized. Call initializeChat first.");
  }

  let fullResponse = '';
  try {
    // We do NOT pass 'history' here. The 'chatInstance' maintains its own state/history.
    const responseStream = await chatInstance.sendMessageStream({
      message: message.text,
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        fullResponse += chunk.text;
      }
    }

    return fullResponse;
  } catch (error: any) {
    console.error("Error sending message to Gemini:", error);
    if (error.message && error.message.includes("Requested entity was not found.")) {
      alert("There might be an issue with the API key or model. Please try again.");
    }
    throw error;
  }
};
