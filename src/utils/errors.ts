/** Extrai uma mensagem legível de qualquer valor capturado em um `catch`. */
export function errorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
