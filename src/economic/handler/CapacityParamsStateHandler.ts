import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { StateHandler, Status, Verifiable } from 'common/verifiable'
import { DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH } from 'economic/const'
import { CapacityParamsDto, CapacityParamsState, CapacityParamsStateHandlerKwArgs } from 'economic/model/capacity-params'

export class CapacityParamsStateHandler extends StateHandler<CapacityParamsState> {
  private massHandler = new FloatStringStateHandler(0, 110e3, 3, false)
  private intervalHandler = new FloatStringStateHandler(0, 1440, 1, false)
  private trainQtyHandler = new FloatStringStateHandler(0, 1000, 1, false)

  fromDto(dto: CapacityParamsDto): CapacityParamsState {
    return this.create(dto)
  }

  toDto(state: CapacityParamsState): CapacityParamsDto {
    throw new Error('Method not implemented.')
  }

  validate(tgt: CapacityParamsState): Status {
    this.reset(tgt)

    if (tgt.oldCapacityInfo === null) {
      this.intervalHandler.checkIsNotBlank(tgt.oldInterval)
      this.trainQtyHandler.checkIsNotBlank(tgt.oldTrainQty)
    } else {
      if (tgt.oldInterval.value !== '' && !this.intervalHandler.equal(tgt.oldInterval, tgt.oldCapacityInfo.interval)) {
        this.intervalHandler.addWarning(tgt.oldInterval, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
      if (tgt.oldTrainQty.value !== '' && !this.trainQtyHandler.equal(tgt.oldTrainQty, tgt.oldCapacityInfo.trainQty)) {
        this.trainQtyHandler.addWarning(tgt.oldTrainQty, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
    }

    if (tgt.newCapacityInfo === null) {
      this.intervalHandler.checkIsNotBlank(tgt.newInterval)
      this.trainQtyHandler.checkIsNotBlank(tgt.newTrainQty)
    } else {
      if (tgt.newInterval.value !== '' && !this.intervalHandler.equal(tgt.newInterval, tgt.newCapacityInfo.interval)) {
        this.intervalHandler.addWarning(tgt.newInterval, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
      if (tgt.newTrainQty.value !== '' && !this.trainQtyHandler.equal(tgt.newTrainQty, tgt.newCapacityInfo.trainQty)) {
        this.trainQtyHandler.addWarning(tgt.newTrainQty, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
    }

    if (tgt.oldCapacityInfo === null && tgt.newCapacityInfo === null) {
      this.massHandler.checkIsNotBlank(tgt.maxTrainMass)
    } else {
      if (tgt.maxTrainMass.value !== '' && !this.massHandler.equal(tgt.maxTrainMass, this.defaultMass(tgt)!)) {
        this.massHandler.addWarning(tgt.maxTrainMass, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
    }
    for (const v of Object.values(tgt)) {
      if (v?.status != null) {
        this.transferStatus(tgt, v as Verifiable)
      }
    }
    return tgt.status
  }

  defaultMass(tgt: CapacityParamsState): string {
    if (tgt.oldCapacityInfo == null && tgt.newCapacityInfo == null) {
      return ''
    }
    return this.massHandler.normalized(Math.max(tgt.oldCapacityInfo?.maxTrainMass ?? 0, tgt.newCapacityInfo?.maxTrainMass ?? 0).toString())
  }

  create(kwargs: CapacityParamsStateHandlerKwArgs) {
    const s: CapacityParamsState = {
      handle: StateHandler.cnt++,
      status: Status.Ok,
      oldCapacityInfo: kwargs.oldCapacityInfo ?? null,
      newCapacityInfo: kwargs.newCapacityInfo ?? null,
      maxTrainMass: this.massHandler.create(kwargs.maxTrainMass?.toString()),
      oldInterval: this.intervalHandler.create(kwargs.oldInterval?.toString()),
      newInterval: this.intervalHandler.create(kwargs.newInterval?.toString()),
      oldTrainQty: this.trainQtyHandler.create(kwargs.oldTrainQty?.toString()),
      newTrainQty: this.trainQtyHandler.create(kwargs.newTrainQty?.toString())
    }
    this.validate(s)
    return s
  }

  update(tgt: CapacityParamsState, kwargs: CapacityParamsStateHandlerKwArgs): CapacityParamsState {
    tgt.maxTrainMass = this.massHandler.createOrDefault(kwargs.maxTrainMass?.toString(), tgt.maxTrainMass)
    tgt.oldInterval = this.intervalHandler.createOrDefault(kwargs.oldInterval?.toString(), tgt.oldInterval)
    tgt.newInterval = this.intervalHandler.createOrDefault(kwargs.newInterval?.toString(), tgt.newInterval)
    tgt.oldTrainQty = this.trainQtyHandler.createOrDefault(kwargs.oldTrainQty?.toString(), tgt.oldTrainQty)
    tgt.newTrainQty = this.trainQtyHandler.createOrDefault(kwargs.newTrainQty?.toString(), tgt.newTrainQty)

    if (kwargs.oldCapacityInfo !== undefined) {
      tgt.oldCapacityInfo = kwargs.oldCapacityInfo
      tgt.maxTrainMass = this.massHandler.copy(tgt.maxTrainMass)
      tgt.oldInterval = this.intervalHandler.copy(tgt.oldInterval)
      tgt.oldTrainQty = this.trainQtyHandler.copy(tgt.oldTrainQty)
    }
    if (kwargs.newCapacityInfo !== undefined) {
      tgt.newCapacityInfo = kwargs.newCapacityInfo
      tgt.maxTrainMass = this.massHandler.copy(tgt.maxTrainMass)
      tgt.newInterval = this.intervalHandler.copy(tgt.newInterval)
      tgt.newTrainQty = this.trainQtyHandler.copy(tgt.newTrainQty)
    }
    this.validate(tgt)
    return tgt
  }
}
