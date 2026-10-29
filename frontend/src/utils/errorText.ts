export const errorText = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;