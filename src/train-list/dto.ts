/** Поезд. */
export interface TrainDto {
  /** Наименование. */
  name: string;

  /** Описание. */
  description: string;

  /** Массив характеристик. */
  characteristics: TrainCharacteristicDto[];
}

/** Характеристика поезда. */
export interface TrainCharacteristicDto {
  /** Скорость, км/ч. */
  speed: number;

  /** Сила тяги, кН. */
  force: number;

  /** Ток двигателя, А. */
  engineAmperage: number;
}
