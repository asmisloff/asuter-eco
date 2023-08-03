import {
  StringState,
  StringStateHandler,
  isBlank
} from '.././StringStateHandler'
import { Status } from '.././verifiable'

export class FloatStringStateHandler extends StringStateHandler<number> {
  private minValue: number
  private maxValue: number
  private precision: number
  private required: boolean

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
        tgt.value = this.format(n, this.precision)
      }
    }
    return tgt.status
  }

  private format(v: number, maxFractionDigits?: number, minFractionDigits?: number): string {
    const options = { maximumFractionDigits: maxFractionDigits, minimumFractionDigits: minFractionDigits }
    return (+v).toLocaleString('ru', options)
  }
}
