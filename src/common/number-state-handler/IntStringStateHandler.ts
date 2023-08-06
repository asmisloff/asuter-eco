import {
  StringState,
  isBlank
} from '.././StringStateHandler';
import { Status } from '.././verifiable';
import { FloatStringStateHandler } from './FloatStringStateHandler';

export class IntStringStateHandler extends FloatStringStateHandler {
  readonly minValue: number;
  readonly maxValue: number;
  readonly required: boolean;

  constructor(minValue: number, maxValue: number, required: boolean) {
    super(minValue, maxValue, 0, required);
    if (
      minValue < Number.MIN_SAFE_INTEGER ||
      maxValue > Number.MAX_SAFE_INTEGER
    ) {
      throw new Error('Недопустимые предельные значения целого числа');
    }
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.required = required;
  }
}
