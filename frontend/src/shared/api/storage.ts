// Мок-хранилище в localStorage. После интеграции с backend заменится на запросы к API.

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key: string): void {
  localStorage.removeItem(key);
}

/** Бросает ApiError с кодом 422, если валидатор вернул текст ошибки. */
export function assertValid(error: string | undefined): void {
  if (error) throw new ApiError(error, 422);
}
