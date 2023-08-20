import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { Status } from 'common/verifiable'
import { DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH } from 'economic/const'
import { CapacityParamsState, CapacityParamsKw, CapacityInfo } from 'economic/model/capacity-params'

export class CapacityParamsStateHandler extends StringStateRecordHandler<CapacityParamsState, CapacityParamsKw> {
  private massHandler = new FloatStringStateHandler(0, 110e3, 3, false)
  private intervalHandler = new FloatStringStateHandler(0, 1440, 1, false)
  private trainQtyHandler = new FloatStringStateHandler(0, 1000, 1, false)

  readonly handlers: Record<keyof CapacityParamsKw, StringStateHandler | ((arg?: any) => any)> = {
    oldCapacityInfo: (v: CapacityInfo) => v === undefined ? null : v,
    newCapacityInfo: (v: CapacityInfo) => v === undefined ? null : v,
    maxTrainMass: this.massHandler,
    oldInterval: this.intervalHandler,
    newInterval: this.intervalHandler,
    oldTrainQty: this.trainQtyHandler,
    newTrainQty: this.trainQtyHandler
  }

  validate(tgt: CapacityParamsState): Status {
    if (tgt.oldCapacityInfo === null) {
      this.intervalHandler.checkIsNotBlank(tgt.oldInterval)
      this.trainQtyHandler.checkIsNotBlank(tgt.oldTrainQty)
    } else {
      this.intervalHandler.validate(tgt.oldInterval)
      this.trainQtyHandler.validate(tgt.oldTrainQty)
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
      this.intervalHandler.validate(tgt.newInterval)
      this.trainQtyHandler.validate(tgt.newTrainQty)
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
      this.massHandler.validate(tgt.maxTrainMass)
      if (tgt.maxTrainMass.value !== '' && !this.massHandler.equal(tgt.maxTrainMass, this.defaultMass(tgt)!)) {
        this.massHandler.addWarning(tgt.maxTrainMass, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
    }

    return super.validate(tgt)
  }

  defaultMass(tgt: CapacityParamsState): string {
    if (tgt.oldCapacityInfo == null && tgt.newCapacityInfo == null) {
      return ''
    }
    return this.massHandler.normalized(Math.max(tgt.oldCapacityInfo?.maxTrainMass ?? 0, tgt.newCapacityInfo?.maxTrainMass ?? 0).toString())
  }
}
