/**
 * Здесь определены базовые типы, на которых основана предлагаемая стратения управления
 * состоянием объектов со сложной валидацией.
 */

/** Базовый интерфейс всех верифицируемых объектов. */
export interface Verifiable {
  /** Идентификатор объекта. */
  handle: number;
  /** Статус - результат последней валидации объекта. */
  status: Status;
  /** Массив строк, разъясняющих ошибку или предупреждение. */
  what?: string[];
}

/** Статус верифицируемого объекта. */
export enum Status {
  Ok,
  Warning,
  Error
}

/**
 * Инкапсулирует логику управления состоянием верефицируемых объектов.
 * @param S тип управляемого объекта.
 * @param D тип Dto управляемого объекта.
 */
export abstract class StateHandler<S extends Verifiable> {
  /** Счетчик с автоинкрементом при создании новго объекта StringState.
   * Текущее значение присваивается полю handle вновь создаваемого объекта.
   */
  protected static cnt = Number.MIN_SAFE_INTEGER;

  /**
   * Проверяет собственные инварианты объекта. Изменяет status и what управляемого объекта.
   * @returns статус объекта
   */
  abstract validate(tgt: S): Status;

  /**
   * Добавить сведения об ошибке в управляемом объекте.
   * @param tgt целевой объект
   * @param e строка или массив строк с текстами ошибок
   */
  addError(tgt: Verifiable, e: string): void {
    tgt.status = Status.Error;
    if (tgt.what == null) {
      tgt.what = [];
    }
    if (tgt.what!.find((it) => it === e) == null) {
      tgt.what.push(e);
    }
  }

  /**
   * Добавить сведения о предупреждении в управляемом объекте.
   * @param tgt целевой объект
   * @param w строка или массив строк с текстами ошибок
   */
  addWarning(tgt: Verifiable, w: string): void {
    tgt.status = Math.max(Status.Warning, tgt.status);
    if (tgt.what == null) {
      tgt.what = [];
    }
    if (tgt.what!.find((it) => it === w) == null) {
      tgt.what.push(w);
    }
  }

  transferStatus(tgt: Verifiable, src: Verifiable): void {
    tgt.status = Math.max(tgt.status, src.status);
    for (const s of src.what ?? []) {
      const m = src.status === Status.Warning ? this.addWarning : this.addError;
      m(tgt, s);
    }
  }

  /**
   *
   * @param tgt целевой объект.
   * @param condition условие логическое значение или выражение, вычисляемое в логическое значение.
   * @param status статус, который требуется назначить объекту, если условие ложно.
   * @param msg текст ошибки или предупреждения.
   */
  check(
    tgt: Verifiable,
    condition: boolean,
    status: Status.Error | Status.Warning,
    msg: string
  ) {
    if (!condition) {
      switch (status) {
        case Status.Warning:
          this.addWarning(tgt, msg);
          break;
        case Status.Error:
          this.addError(tgt, msg);
          break;
        default:
          break;
      }
    }
    return condition;
  }

  /** Подготовить объект в валидации: установить status = Ok, удалить what. */
  reset(tgt: Verifiable) {
    tgt.status = Status.Ok;
    delete tgt.what;
  }
}
