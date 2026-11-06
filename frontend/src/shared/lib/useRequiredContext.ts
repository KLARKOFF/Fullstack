import { useContext } from 'react';
import type { Context } from 'react';

/** useContext, который падает с понятной ошибкой, если компонент стоит вне провайдера. */
export function useRequiredContext<T>(context: Context<T | null>, hookName: string): T {
  const value = useContext(context);
  if (value === null) {
    throw new Error(`${hookName}() можно вызывать только внутри соответствующего провайдера`);
  }
  return value;
}
