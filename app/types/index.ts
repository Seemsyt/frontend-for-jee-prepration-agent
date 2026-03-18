export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  thread_id?: string;
}

export interface Thread {
  id: string;
  title: string;
}