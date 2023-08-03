import {
  StringState,
  StringStateHandler
} from "../../common/StringStateHandler";
import { Status } from "../../common/verifiable";

export class SpeedStateHandler extends StringStateHandler<number> {
  /** Мы не хотим проблем с дублированием handle-ов, поэтому Singleton. */
  private constructor() {
    super();
  }

  static readonly instance = new SpeedStateHandler();

  toDto(tgt: StringState): number {
    return +tgt.value;
  }

  validate(tgt: StringState): Status {
    this.reset(tgt);
    const numberValue = this.checkIsNumber(tgt);
    if (!isNaN(numberValue)) {
      this.checkInRange(tgt, numberValue, 0, 300);
      this.checkIsInteger(tgt, numberValue);
    }
    return tgt.status;
  }
}

export class ForceStateHandler extends StringStateHandler<number> {
  /** Мы не хотим проблем с дублированием handle-ов, поэтому Singleton. */
  private constructor() {
    super();
  }

  static readonly instance = new ForceStateHandler();

  toDto(tgt: StringState): number {
    return +tgt.value;
  }

  validate(tgt: StringState): Status {
    this.reset(tgt);
    const numberValue = this.checkIsNumber(tgt);
    if (!isNaN(numberValue)) {
      this.checkInRange(tgt, numberValue, 1, 1000);
    }
    return tgt.status;
  }

  create(value?: string): StringState {
    if (value == null || value === "") {
      return super.create("");
    }
    let numberValue = +value;
    if (!isNaN(numberValue)) {
      numberValue = +numberValue.toFixed(2);
      return super.create(numberValue.toString());
    }
    return super.create(value);
  }
}

export class AmperageStateHandler extends StringStateHandler<number> {
  /** Мы не хотим проблем с дублированием handle-ов, поэтому Singleton. */
  private constructor() {
    super();
  }

  static readonly instance = new AmperageStateHandler();

  toDto(tgt: StringState): number {
    return +tgt.value;
  }

  validate(tgt: StringState): Status {
    this.reset(tgt);
    const numberValue = this.checkIsNumber(tgt);
    if (!isNaN(numberValue)) {
      this.checkInRange(tgt, numberValue, 1, 5000);
    }
    return tgt.status;
  }

  create(value?: string): StringState {
    if (value == null || value === "") {
      return super.create("");
    }
    let numberValue = +value;
    if (!isNaN(numberValue)) {
      numberValue = +numberValue.toFixed(2);
      return super.create(numberValue.toString());
    }
    return super.create(value);
  }
}
