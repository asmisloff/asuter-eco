import {
  StringState,
  StringStateHandler,
  format,
  isBlank
} from '.././StringStateHandler'
import { Status } from '.././verifiable'

export class FloatStringStateHandler extends StringStateHandler<number> {
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

  toOptionalDto(state: StringState): number | undefined {
    if (isBlank(state.value) && !this.required) {
      return undefined
    }
    return this.toDto(state)
  }

  toDto(state: StringState): number {
    return +state.value
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
      }
    }
    return tgt.status
  }

  normalized(s?: string): string {
    const n = this.parseNumber(s ?? '')
    if (isNaN(n)) {
      return s ?? ''
    }
    return format(n, this.precision)
  }

  equal(tgt: StringState, value: number | string): boolean {
    if (typeof(value) === 'number') {
      value = format(value, this.precision, undefined, '')
    }
    return value === tgt.value
  }
}
