import { ApiError } from './storage';

// Мок-API отвечает с задержкой, как настоящий сервер, — чтобы было видно состояния загрузки.
// Для демонстрации можно добавить параметры в адрес страницы:
//   ?mockDelay=2000  — задержка ответа в мс (по умолчанию 300–700 мс)
//   ?mockError=1     — все запросы завершаются ошибкой
//   ?mockError=0.3   — ошибкой завершается примерно 30% запросов
//   ?mockError=0     — выключить ошибки
// Значения запоминаются до закрытия вкладки, поэтому не теряются при переходах между страницами.

function readOption(name: string): number | null {
  const fromUrl = new URLSearchParams(window.location.search).get(name);
  if (fromUrl !== null) sessionStorage.setItem(name, fromUrl);

  const raw = fromUrl ?? sessionStorage.getItem(name);
  if (raw === null || raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Выполняет handler как «запрос к серверу»: с задержкой и, если включено, со случайной ошибкой. */
export async function mockRequest<T>(handler: () => T): Promise<T> {
  await sleep(readOption('mockDelay') ?? 300 + Math.random() * 400);

  const errorRate = readOption('mockError') ?? 0;
  if (Math.random() < errorRate) {
    throw new ApiError('Сервер не отвечает. Попробуйте ещё раз', 503);
  }
  return handler();
}
