import {
  StringState,
  StringStateHandler,
  isBlank
} from ".././StringStateHandler";
import { Status } from ".././verifiable";

export class IntStringStateHandler extends StringStateHandler<number> {
  private minValue: number;
  private maxValue: number;
  private required: boolean;

  constructor(minValue: number, maxValue: number, required: boolean) {
    super();
    if (
      minValue < Number.MIN_SAFE_INTEGER ||
      maxValue > Number.MAX_SAFE_INTEGER
    ) {
      throw new Error("Недопустимые предельные значения целого числа");
    }
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.required = required;
  }

  toOptionalDto(state: StringState): number | undefined {
    if (isBlank(state.value) && !this.required) {
      return undefined;
    }
    return this.toDto(state);
  }

  toDto(state: StringState): number {
    return +state.value;
  }

  validate(tgt: StringState): Status {
    this.reset(tgt);
    if (this.required) {
      this.checkIsNotBlank(tgt);
    }
    if (!isBlank(tgt.value)) {
      const n = this.checkIsNumber(tgt);
      if (!isNaN(n)) {
        const isInt = this.checkIsInteger(tgt, n);
        if (isInt) {
          this.checkInRange(tgt, n, this.minValue, this.maxValue);
          tgt.value = n.toString();
        }
      }
    }
    return tgt.status;
  }
}
