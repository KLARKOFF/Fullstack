import { assertValid, load, mockRequest, save } from '@/shared/api';
import type { Laundry } from '../model/types';
import { validateLaundryName } from '../model/validation';

// Мок-API на localStorage. После интеграции с backend здесь будут запросы к /api/laundries.
const KEY = 'mock_laundry';
const SEED: Laundry = { id: '1', name: 'Общежитие №1' };

export function getLaundry(): Promise<Laundry> {
  return mockRequest(() => load<Laundry>(KEY, SEED));
}

export function updateLaundry(name: string): Promise<Laundry> {
  return mockRequest(() => {
    assertValid(validateLaundryName(name));
    const updated: Laundry = { ...load<Laundry>(KEY, SEED), name: name.trim() };
    save(KEY, updated);
    return updated;
  });
}
