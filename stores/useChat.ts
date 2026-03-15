import { create } from 'zustand';
import { Language } from '../constants/responses';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

interface ChatState {
  language: Language;
  messages: Message[];
  isTyping: boolean;
  setLanguage: (lang: Language) => void;
  addMessage: (msg: Message) => void;
  setTyping: (v: boolean) => void;
}

export const useChat = create<ChatState>((set) => ({
  language: 'id',
  messages: [],
  isTyping: false,
  setLanguage: (language) => set({ language }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setTyping: (isTyping) => set({ isTyping }),
}));
