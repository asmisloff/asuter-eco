import { DEFAULT_AND_ACTUAL_VALUES_MISMATCH, illegalNumberPrecisionMsg } from 'economic/std-messages'
import {
  StringState,
  StringStateHandler,
  format,
  isBlank
} from '.././StringStateHandler'
import { Status } from '.././verifiable'

/**
 * Контроллер для управления строковым состоянием, которое хранит представление действительного числа.
 */
export class FloatStringStateHandler extends StringStateHandler {
  readonly minValue: number
  readonly maxValue: number
  readonly precision: number
  readonly required: boolean

  constructor(minValue: number, maxValue: number, precision: number, required: boolean) {
    super()
    this.minValue = minValue
    this.maxValue = maxValue
    this.precision = precision
    this.required = required
  }
  
  validate(tgt: StringState): Status {
    this.reset(tgt)
    if (this.required) {
      this.checkIsNotBlank(tgt)
    }
    if (!isBlank(tgt.value)) {
      const n = this.checkIsNumber(tgt)
      if (!isNaN(n)) {
        this.checkInRange(tgt, n, this.minValue, this.maxValue)
        this.check(
          tgt,
          this.numberOfFractionDigits(tgt.value) <= this.precision,
          Status.Error,
          illegalNumberPrecisionMsg(this.precision)
        )
      }
    }
    return tgt.status
  }

  /** Возвращает нормализованное строковое представление числа или пустую строку, если не удалось распознать число. */
  normalized(s?: string): string {
    const n = this.parseNumber(s ?? '')
    if (isNaN(n)) {
      return s ?? ''
    }
    return format(n, 20)
  }

  /** Предикат для проверки равенства с точностью до заданной в поле precision. */
  equal(tgt: StringState, value: number | string): boolean {
    if (typeof(value) === 'number') {
      value = format(value, undefined, undefined, '')
    }
    return value === tgt.value
  }

  /**
   * Сравнить состояние с заданным значением и добавить предупреждение, если они не равны.
   * @param tgt целевое состояние.
   * @param defaultValue заданное значение для сравнения.
   */
  compareToDefault(tgt: StringState, defaultValue: number | string): boolean {
    if (tgt.value !== '' && !this.equal(tgt, defaultValue)) {
      this.addWarning(tgt, DEFAULT_AND_ACTUAL_VALUES_MISMATCH)
      return false
    }
    return true
  }

  /** Количество цифр после десятичного разделителя в строковом представлении действительного числа. */
  numberOfFractionDigits(s: string): number {
    const commaIdx = s.lastIndexOf(',')
    if (commaIdx < 0) {
      return 0
    }
    return s.length - commaIdx - 1
  }
}
