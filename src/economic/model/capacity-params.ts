import { Status, Verifiable } from "../../common/verifiable";
import {
  isBlank,
  StringState,
  StringStateHandler
} from "../../common/StringStateHandler";
import { IntStringStateHandler } from "../../common/number-state-handlers";
import { StateHandler } from "../../common/verifiable";

export interface CapacityParamsState extends Verifiable {
  oldCapacityInfo: CapacityInfo | null;
  newCapacityInfo: CapacityInfo | null;
  maxTrainMass: StringState;
  oldInterval: StringState;
  newInterval: StringState;
  oldTrainQty: StringState;
  newTrainQty: StringState;
}

interface CapacityInfo {
  id: number;
  maxTrainMass: number;
  interval: number;
  trainQty: number;
}

export interface CapacityParamsDto {
  oldCapacityId?: CapacityInfo;
  newCapacityId?: CapacityInfo;
  maxTrainMass?: number;
  oldInterval?: number;
  newInterval?: number;
  oldTrainQty?: number;
  newTrainQty?: number;
}

export class CapacityParamsStateHandler extends StateHandler<
  CapacityParamsState,
  CapacityParamsDto
> {
  private massHandler = new IntStringStateHandler(0, 10000, false);
  private intervalHandler = new IntStringStateHandler(0, 40, false);
  private trainQtyHandler = new IntStringStateHandler(0, 10000, false);

  fromDto(dto: CapacityParamsDto): CapacityParamsState {
    return this.create(dto);
  }

  toDto(state: CapacityParamsState): CapacityParamsDto {
    throw new Error("Method not implemented.");
  }

  validate(tgt: CapacityParamsState): Status {
    this.reset(tgt);

    this.massHandler.validate(tgt.maxTrainMass);
    this.intervalHandler.validate(tgt.oldInterval);
    this.trainQtyHandler.validate(tgt.oldTrainQty);
    this.intervalHandler.validate(tgt.newInterval);
    this.trainQtyHandler.validate(tgt.newTrainQty);

    if (tgt.oldCapacityInfo == null) {
      this.intervalHandler.checkIsNotBlank(tgt.oldInterval);
      this.trainQtyHandler.checkIsNotBlank(tgt.oldTrainQty);
    }
    if (tgt.newCapacityInfo == null) {
      this.intervalHandler.checkIsNotBlank(tgt.newInterval);
      this.trainQtyHandler.checkIsNotBlank(tgt.newTrainQty);
    }
    if (tgt.oldCapacityInfo == null && tgt.newCapacityInfo == null) {
      this.massHandler.checkIsNotBlank(tgt.maxTrainMass);
    } else {
      if (
        !isBlank(tgt.maxTrainMass.value) &&
        this.defaultMass(tgt) !== +tgt.maxTrainMass.value
      ) {
        this.massHandler.addWarning(
          tgt.maxTrainMass,
          "Введенное значение не совпадает с массой поезда из результатов расчета"
        );
      }
    }
    for (const v of Object.values(tgt)) {
      if (v?.status != null) {
        this.transferStatus(tgt, v as Verifiable);
      }
    }
    return tgt.status;
  }

  defaultMass(tgt: CapacityParamsState): number | null {
    if (tgt.oldCapacityInfo == null && tgt.newCapacityInfo == null) {
      return null;
    }
    return Math.max(
      tgt.oldCapacityInfo?.maxTrainMass ?? 0,
      tgt.newCapacityInfo?.maxTrainMass ?? 0
    );
  }

  create(kwargs: CapacityParamsStateHandlerKwArgs) {
    const s: CapacityParamsState = {
      handle: this.cnt++,
      status: Status.Ok,
      oldCapacityInfo: kwargs.oldCapacityInfo ?? null,
      newCapacityInfo: kwargs.newCapacityInfo ?? null,
      maxTrainMass: this.massHandler.create(kwargs.maxTrainMass?.toString()),
      oldInterval: this.intervalHandler.create(kwargs.oldInterval?.toString()),
      newInterval: this.intervalHandler.create(kwargs.newInterval?.toString()),
      oldTrainQty: this.trainQtyHandler.create(kwargs.oldTrainQty?.toString()),
      newTrainQty: this.trainQtyHandler.create(kwargs.newTrainQty?.toString())
    };
    this.validate(s);
    return s;
  }

  update(
    tgt: CapacityParamsState,
    kwargs: CapacityParamsStateHandlerKwArgs
  ): CapacityParamsState {
    this.reset(tgt);
    if (kwargs.oldCapacityInfo !== undefined) {
      tgt.oldCapacityInfo = kwargs.oldCapacityInfo;
    }
    if (kwargs.newCapacityInfo !== undefined) {
      tgt.newCapacityInfo = kwargs.newCapacityInfo;
    }
    if (kwargs.maxTrainMass !== undefined) {
      tgt.maxTrainMass = this.massHandler.create(
        kwargs.maxTrainMass.toString()
      );
    }
    if (kwargs.oldInterval !== undefined) {
      tgt.oldInterval = this.intervalHandler.create(
        kwargs.oldInterval.toString()
      );
    }
    if (kwargs.newInterval !== undefined) {
      tgt.newInterval = this.intervalHandler.create(
        kwargs.newInterval.toString()
      );
    }
    if (kwargs.oldTrainQty !== undefined) {
      tgt.oldTrainQty = this.trainQtyHandler.create(
        kwargs.oldTrainQty.toString()
      );
    }
    if (kwargs.newTrainQty !== undefined) {
      tgt.newTrainQty = this.trainQtyHandler.create(
        kwargs.newTrainQty.toString()
      );
    }
    if (kwargs.oldCapacityInfo !== undefined) {
      tgt.maxTrainMass = this.massHandler.copy(tgt.maxTrainMass);
      tgt.oldInterval = this.massHandler.copy(tgt.oldInterval);
      tgt.oldTrainQty = this.massHandler.copy(tgt.oldTrainQty);
    }
    if (kwargs.newCapacityInfo !== undefined) {
      tgt.maxTrainMass = this.massHandler.copy(tgt.maxTrainMass);
      tgt.newInterval = this.massHandler.copy(tgt.newInterval);
      tgt.newTrainQty = this.massHandler.copy(tgt.newTrainQty);
    }
    return tgt;
  }
}

export interface CapacityParamsStateHandlerKwArgs {
  oldCapacityInfo?: CapacityInfo;
  newCapacityInfo?: CapacityInfo;
  maxTrainMass?: string | number;
  oldInterval?: string | number;
  newInterval?: string | number;
  oldTrainQty?: string | number;
  newTrainQty?: string | number;
}
