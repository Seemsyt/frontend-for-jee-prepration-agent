import { Message, ChatRequest, ThreadInfo } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getAllThreads(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/all/threads`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch threads');
  }
  
  return response.json();
}

export async function getThreadMessages(threadId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/messages?thread_id=${threadId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch thread messages');
  }
  
  const rawMessages = await response.json();
  
  // Transform LangChain message format to our format
  return rawMessages.map((msg: any) => ({
    role: msg.role === 'human' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

export async function* streamChat(
  message: string, 
  threadId?: string
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${API_BASE_URL}/chat-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, thread_id: threadId }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  if (!reader) {
    throw new Error('No reader available');
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      yield chunk;
    }
  } finally {
    reader.releaseLock();
  }
}