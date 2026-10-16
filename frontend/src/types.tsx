export type MachineStatus = 'free' | 'in_use' | 'waiting';

export interface Machine {
  id: string;              // Номер машины (например, "01", "02")
  type: 'washer' | 'dryer'; // Стиральная или сушильная
  capacity: number;        // Вместимость в кг (например, 6 или 8)
  status: MachineStatus;   // Статус
  timeLeft?: string;       // Оставшееся время (для 'in_use')
  endTime?: string;        // Время завершения
  currentStage?: string;   // Текущий этап (например, "Полоскание", "Сушка")
  progress?: number;       // Процент выполнения (0-100)
}