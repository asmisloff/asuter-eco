import { isBlank } from 'common/StringStateHandler';
import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler';
import { StateHandler, Status, Verifiable } from 'common/verifiable';
import { CapacityParamsDto, CapacityParamsState, CapacityParamsStateHandlerKwArgs } from 'economic/model/capacity-params';

export class CapacityParamsStateHandler extends StateHandler<CapacityParamsState, CapacityParamsDto> {
  private massHandler = new FloatStringStateHandler(0, 10000, 3, false);
  private intervalHandler = new FloatStringStateHandler(0, 40, 1, false);
  private trainQtyHandler = new FloatStringStateHandler(0, 10000, 1, false);
  private readonly DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH = 'Введенное значение не совпадает с интервалом из результатов расчета'

  fromDto(dto: CapacityParamsDto): CapacityParamsState {
    return this.create(dto);
  }

  toDto(state: CapacityParamsState): CapacityParamsDto {
    throw new Error('Method not implemented.');
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
    } else {
      if (!isBlank(tgt.oldInterval.value) && tgt.oldCapacityInfo.interval !== +tgt.oldInterval.value) {
        this.intervalHandler.addWarning(tgt.oldInterval, this.DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH);
      }
      if (!isBlank(tgt.oldTrainQty.value) && tgt.oldCapacityInfo.trainQty !== +tgt.oldTrainQty.value) {
        this.trainQtyHandler.addWarning(tgt.oldTrainQty, this.DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
    }

    if (tgt.newCapacityInfo == null) {
      this.intervalHandler.checkIsNotBlank(tgt.newInterval);
      this.trainQtyHandler.checkIsNotBlank(tgt.newTrainQty);
    } else {
      if (!isBlank(tgt.newInterval.value) && tgt.newCapacityInfo.interval !== +tgt.newInterval.value) {
        this.intervalHandler.addWarning(tgt.newInterval, this.DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
      if (!isBlank(tgt.newTrainQty.value) && tgt.newCapacityInfo.trainQty !== +tgt.newTrainQty.value) {
        this.trainQtyHandler.addWarning(tgt.newTrainQty, this.DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
    }

    if (tgt.oldCapacityInfo == null && tgt.newCapacityInfo == null) {
      this.massHandler.checkIsNotBlank(tgt.maxTrainMass);
    } else {
      if (!isBlank(tgt.maxTrainMass.value) && this.defaultMass(tgt) !== +tgt.maxTrainMass.value) {
        this.massHandler.addWarning(
          tgt.maxTrainMass,
          'Введенное значение не совпадает с массой поезда из результатов расчета'
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

  update(tgt: CapacityParamsState,kwargs: CapacityParamsStateHandlerKwArgs): CapacityParamsState {
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
