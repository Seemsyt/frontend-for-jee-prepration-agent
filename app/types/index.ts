export interface Message {
  role: 'human' | 'assistant';
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