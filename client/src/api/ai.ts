import apiClient from './apiClient';
import type { Model, GenerateRequest, GenerateResponse } from '@/types/ai';

export const getAvailableModels = async (): Promise<Model[]> => {
  const { data } = await apiClient.get('/tags');
  return data.models;
};

export const sendMessage = async (
  request: GenerateRequest,
  signal?: AbortSignal
): Promise<GenerateResponse> => {
  const { data } = await apiClient.post('/generate', request, {
    signal,
  });
  return data;
};
