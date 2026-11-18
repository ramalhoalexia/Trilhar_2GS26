import { useCallback } from 'react';
import { useRouter, type Href } from 'expo-router';

/**
 * Volta para a tela anterior. Se a tela foi aberta direto por um link
 * (sem histórico), vai para `fallback` em vez de ficar parada.
 */
export default function useGoBack(fallback: Href = '/') {
  const router = useRouter();
  return useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
  }, [router, fallback]);
}
