import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { Status } from 'common/verifiable'
import { DEFAULT_AND_ACTUAL_VALUES_MISMATCH } from 'economic/std-messages'
import { ParallelEconComputationDto } from 'economic/model/dto'
import { ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from 'economic/model/parallel-schedule-params'

export class ParallelScheduleParamsStateHandler extends StringStateRecordHandler<ParallelScheduleParamsState, ParallelScheduleParamsKwArgs> {
    
    readonly dcHandler = new FloatStringStateHandler(0, 1e6, 3, false)
    
    handlers: Record<keyof ParallelScheduleParamsKwArgs, StringStateHandler | ((arg?: any) => any)> = {
        oldComputation: (c?: ParallelEconComputationDto) => c === undefined ? null : c,
        newComputation: (c?: ParallelEconComputationDto) => c === undefined ? null : c,
        oldDailyConsumption: this.dcHandler,
        newDailyConsumption: this.dcHandler
    }

    validate(tgt: ParallelScheduleParamsState): Status {
        this.reset(tgt)

        this.dcHandler.validate(tgt.oldDailyConsumption)
        if (tgt.oldComputation === null) {
            this.dcHandler.checkIsNotBlank(tgt.oldDailyConsumption)
        } else {
            if (tgt.oldDailyConsumption.value !== '' && !this.dcHandler.equal(tgt.oldDailyConsumption, tgt.oldComputation.energyConsumption)) {
                this.dcHandler.addWarning(tgt.oldDailyConsumption, DEFAULT_AND_ACTUAL_VALUES_MISMATCH)
            }
        }

        this.dcHandler.validate(tgt.newDailyConsumption)
        if (tgt.newComputation === null) {
            this.dcHandler.checkIsNotBlank(tgt.newDailyConsumption)
        } else {
            if (tgt.newDailyConsumption.value !== '' && !this.dcHandler.equal(tgt.newDailyConsumption, tgt.newComputation.energyConsumption)) {
                this.dcHandler.addWarning(tgt.newDailyConsumption, DEFAULT_AND_ACTUAL_VALUES_MISMATCH)
            }
        }

        this.transferStatus(tgt, tgt.oldDailyConsumption)
        this.transferStatus(tgt, tgt.newDailyConsumption)
        return tgt.status
    }
}