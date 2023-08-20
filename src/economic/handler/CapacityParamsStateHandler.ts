import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { Status } from 'common/verifiable'
import { DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH } from 'economic/const'
import { CapacityParamsState, CapacityParamsKw } from 'economic/model/capacity-params'
import { CapacityEconComputationDto } from 'economic/model/dto'

export class CapacityParamsStateHandler extends StringStateRecordHandler<CapacityParamsState, CapacityParamsKw> {
  private massHandler = new FloatStringStateHandler(0, 110e3, 3, false)
  private intervalHandler = new FloatStringStateHandler(0, 1440, 1, false)
  private trainQtyHandler = new FloatStringStateHandler(0, 1000, 1, false)

  readonly handlers: Record<keyof CapacityParamsKw, StringStateHandler | ((arg?: any) => any)> = {
    oldCapacityDto: (v: CapacityEconComputationDto) => v === undefined ? null : v,
    newCapacityDto: (v: CapacityEconComputationDto) => v === undefined ? null : v,
    maxTrainMass: this.massHandler,
    oldInterval: this.intervalHandler,
    newInterval: this.intervalHandler,
    oldTrainQty: this.trainQtyHandler,
    newTrainQty: this.trainQtyHandler
  }

  validate(tgt: CapacityParamsState): Status {
    if (tgt.oldCapacityDto === null) {
      this.intervalHandler.checkIsNotBlank(tgt.oldInterval)
      this.trainQtyHandler.checkIsNotBlank(tgt.oldTrainQty)
    } else {
      this.intervalHandler.validate(tgt.oldInterval)
      this.trainQtyHandler.validate(tgt.oldTrainQty)
      if (tgt.oldInterval.value !== '' && !this.intervalHandler.equal(tgt.oldInterval, tgt.oldCapacityDto.trainInterval)) {
        this.intervalHandler.addWarning(tgt.oldInterval, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
      if (tgt.oldTrainQty.value !== '' && !this.trainQtyHandler.equal(tgt.oldTrainQty, tgt.oldCapacityDto.trainQty)) {
        this.trainQtyHandler.addWarning(tgt.oldTrainQty, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
    }

    if (tgt.newCapacityDto === null) {
      this.intervalHandler.checkIsNotBlank(tgt.newInterval)
      this.trainQtyHandler.checkIsNotBlank(tgt.newTrainQty)
    } else {
      this.intervalHandler.validate(tgt.newInterval)
      this.trainQtyHandler.validate(tgt.newTrainQty)
      if (tgt.newInterval.value !== '' && !this.intervalHandler.equal(tgt.newInterval, tgt.newCapacityDto.trainInterval)) {
        this.intervalHandler.addWarning(tgt.newInterval, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
      if (tgt.newTrainQty.value !== '' && !this.trainQtyHandler.equal(tgt.newTrainQty, tgt.newCapacityDto.trainQty)) {
        this.trainQtyHandler.addWarning(tgt.newTrainQty, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
      }
    }

    if (tgt.oldCapacityDto === null && tgt.newCapacityDto === null) {
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
    if (tgt.oldCapacityDto == null && tgt.newCapacityDto == null) {
      return ''
    }
    return this.massHandler.normalized(Math.max(tgt.oldCapacityDto?.trainWeightMaximum ?? 0, tgt.newCapacityDto?.trainWeightMaximum ?? 0).toString())
  }
}
