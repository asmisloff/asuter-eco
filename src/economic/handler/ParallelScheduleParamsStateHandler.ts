import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { StateHandler, Status } from 'common/verifiable'
import { DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH } from 'economic/const'
import { ParallelScheduleParamsDto, ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from 'economic/model/parallel-schedule-params'

export class ParallelScheduleParamsStateHandler extends StateHandler<ParallelScheduleParamsState, ParallelScheduleParamsDto> {

    readonly dailyConsumptionHandler = new FloatStringStateHandler(0, 1e6, 2, false)

    fromDto(dto: ParallelScheduleParamsDto): ParallelScheduleParamsState {
        throw new Error('Method not implemented.')
    }

    toDto(state: ParallelScheduleParamsState): ParallelScheduleParamsDto {
        throw new Error('Method not implemented.')
    }

    validate(tgt: ParallelScheduleParamsState): Status {
        this.reset(tgt)

        if (tgt.oldComputation == null) {
            this.dailyConsumptionHandler.checkIsNotBlank(tgt.oldDailyConsumption)
        } else if (!this.dailyConsumptionHandler.equals(tgt.oldDailyConsumption, tgt.oldComputation.consumption)) {
            this.dailyConsumptionHandler.addWarning(tgt.oldDailyConsumption, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
        }

        if (tgt.newComputation == null) {
            this.dailyConsumptionHandler.checkIsNotBlank(tgt.newDailyConsumption)
        } else if (!this.dailyConsumptionHandler.equals(tgt.newDailyConsumption, tgt.newComputation.consumption)) {
            this.dailyConsumptionHandler.addWarning(tgt.newDailyConsumption, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
        }

        this.transferStatus(tgt, tgt.oldDailyConsumption)
        this.transferStatus(tgt, tgt.newDailyConsumption)
        return tgt.status
    }

    create(kwargs: ParallelScheduleParamsKwArgs): ParallelScheduleParamsState {
        return {
            handle: this.cnt++,
            oldComputation: kwargs.oldComputaion ?? null,
            newComputation: kwargs.newComputation ?? null,
            oldDailyConsumption: this.dailyConsumptionHandler.create(kwargs.newDailyConsumption?.toString()),
            newDailyConsumption: this.dailyConsumptionHandler.create(kwargs.oldDailyConsumption?.toString()),
            status: Status.Ok
        }
    }
}