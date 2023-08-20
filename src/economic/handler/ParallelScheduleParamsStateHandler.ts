import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { Status } from 'common/verifiable'
import { DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH } from 'economic/const'
import { ParallelScheduleInfo, ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from 'economic/model/parallel-schedule-params'

export class ParallelScheduleParamsStateHandler extends StringStateRecordHandler<ParallelScheduleParamsState, ParallelScheduleParamsKwArgs> {
    
    readonly dcHandler = new FloatStringStateHandler(0, 1e6, 3, false)
    
    handlers: Record<keyof ParallelScheduleParamsKwArgs, StringStateHandler | ((arg?: any) => any)> = {
        oldComputation: (c?: ParallelScheduleInfo) => c === undefined ? null : c,
        newComputation: (c?: ParallelScheduleInfo) => c === undefined ? null : c,
        oldDailyConsumption: this.dcHandler,
        newDailyConsumption: this.dcHandler
    }

    validate(tgt: ParallelScheduleParamsState): Status {
        this.reset(tgt)

        if (tgt.oldComputation === null) {
            this.dcHandler.checkIsNotBlank(tgt.oldDailyConsumption)
        } else {
            this.dcHandler.validate(tgt.oldDailyConsumption)
            if (tgt.oldDailyConsumption.value !== '' && !this.dcHandler.equal(tgt.oldDailyConsumption, tgt.oldComputation.consumption)) {
                this.dcHandler.addWarning(tgt.oldDailyConsumption, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
            }
        }

        if (tgt.newComputation === null) {
            this.dcHandler.checkIsNotBlank(tgt.newDailyConsumption)
        } else {
            this.dcHandler.validate(tgt.newDailyConsumption)
            if (tgt.newDailyConsumption.value !== '' && !this.dcHandler.equal(tgt.newDailyConsumption, tgt.newComputation.consumption)) {
                this.dcHandler.addWarning(tgt.newDailyConsumption, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
            }
        }

        this.transferStatus(tgt, tgt.oldDailyConsumption)
        this.transferStatus(tgt, tgt.newDailyConsumption)
        return tgt.status
    }
}