import type { Laundry } from '../types';
import { ApiError, load, save } from './storage';

const KEY = 'mock_laundry';
const SEED: Laundry = { id: '1', name: 'Общежитие №1' };

export async function getLaundry(): Promise<Laundry> {
  return load<Laundry>(KEY, SEED);
}

export async function updateLaundry(name: string): Promise<Laundry> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new ApiError('Введите название прачечной', 422);
  }
  if (trimmed.length > 100) {
    throw new ApiError('Название не должно быть длиннее 100 символов', 422);
  }
  const updated: Laundry = { ...load<Laundry>(KEY, SEED), name: trimmed };
  save(KEY, updated);
  return updated;
}
