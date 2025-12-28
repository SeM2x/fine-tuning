import { useQuery } from '@tanstack/react-query';
import { getAvailableModels } from '@/api/ai';

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: getAvailableModels,
    staleTime: 1000 * 60 * 10, // 10 minutes - models don't change often
  });
}
