import { StateHandler, Status, Verifiable } from "./verifiable";

/** Верефицируемое строковое состояние. */
export interface StringState extends Verifiable {
  value: string;
}

export function isBlank(s: string): boolean {
  return s.trim().length === 0;
}

/**
 * Определяет интерфейс и общую логику для управления верифицируемым строковым состоянием.
 */
export abstract class StringStateHandler<D> extends StateHandler<
  StringState,
  D
> {
  fromDto(dto: D): StringState {
    return this.create(`${dto}`);
  }

  abstract toDto(state: StringState): D;

  /**
   * Создать копию управляемого объекта.
   * @param tgt целевой объект.
   * @param value значение. Если не задано, значение берется из целевого объекта.
   */
  copy(tgt: StringState, value?: string): StringState {
    return this.create(value != null ? value : tgt.value);
  }

  /**
   * Создать новый объект StringState.
   * @param value хранимое строковое значение.
   */
  create(value?: string): StringState {
    const instance = {
      handle: this.cnt++,
      value: value?.trim() ?? "",
      status: Status.Ok
    } as StringState;
    return instance;
  }

  abstract validate(tgt: StringState): Status;

  /** Проверить, приводится ли хранимое значение к действительному числу. */
  checkIsNumber(tgt: StringState): number {
    const stringValue = tgt.value;
    const numberValue = isBlank(stringValue) ? NaN : +stringValue;
    if (isNaN(numberValue) || stringValue === "") {
      this.addError(tgt, "Значение должно быть числом");
    }
    return numberValue;
  }

  /** Проверить, приводится ли хранимое значение к действительному числу. */
  checkIsNumberOrBlank(tgt: StringState): number {
    const stringValue = tgt.value;
    const numberValue = +stringValue;
    if (isNaN(numberValue)) {
      this.addError(tgt, "Значение должно быть числом");
    }
    return numberValue;
  }

  checkIsNotBlank(tgt: StringState): boolean {
    const blank = isBlank(tgt.value);
    if (blank) {
      this.addError(tgt, "Необходимо ввести значение");
    }
    return !blank;
  }

  /**
   * Проверить, лежит ли хранимое значение в заданном диапазоне чисел (включительно для обеих границ).
   * @param tgt целевой объект.
   * @param value хранимое значение или число, к которому оно приводится.
   * @param min минимальное значение.
   * @param max максимальное значение.
   */
  checkInRange(
    tgt: StringState,
    value: string | number,
    min: number,
    max: number
  ) {
    const numberValue = typeof value === "number" ? value : +value;
    return this.check(
      tgt,
      numberValue >= min && value <= max,
      Status.Error,
      `Диапазон допустимых значений: ${min}...${max}`
    );
  }

  /**
   *
   * @param tgt целевой объект
   * @param value хранимое значение или число, к которому оно приводится.
   */
  checkIsInteger(tgt: StringState, value: number | string) {
    const numberValue = typeof value === "number" ? value : +value;
    return this.check(
      tgt,
      Number.isInteger(numberValue),
      Status.Error,
      "Значение должно быть целым числом"
    );
  }
}
