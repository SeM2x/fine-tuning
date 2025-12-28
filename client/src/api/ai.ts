import apiClient from './apiClient';
import type { Model, GenerateRequest, GenerateResponse } from '@/types/ai';

export const getAvailableModels = async (): Promise<Model[]> => {
  const { data } = await apiClient.get('/tags');
  return data.models;
};

export const sendMessage = async (
  request: GenerateRequest
): Promise<GenerateResponse> => {
  const { data } = await apiClient.post('/generate', request);
  return data;
};

// For streaming responses if your backend supports it
export const sendMessageStream = async (
  request: GenerateRequest,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
};
