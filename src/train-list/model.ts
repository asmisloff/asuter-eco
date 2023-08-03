import { Verifiable } from "../common/verifiable";
import { StringState } from "../common/StringStateHandler";

/** Список поездов. */
export interface TrainList extends Verifiable {
  /** Актуальный массив поездов. */
  trains: Train[];

  /** Индекс поезда, выбранного пользователем. */
  selectedTrainIdx: number;
}

/** Поезд. */
export interface Train extends Verifiable {
  /** Наименование. */
  name: string;

  /** Описание. */
  description: string;

  /** Массив характеристик. */
  characteristics: TrainCharacteristic[];
}

/** Характеристика поезда. */
export interface TrainCharacteristic extends Verifiable {
  /** Скорость, км/ч. */
  speed: StringState;

  /** Сила, кН. */
  force: StringState;

  /** Ток двигателя, А. */
  engineAmperage: StringState;
}
