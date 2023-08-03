import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler';
import { StateHandler, Status } from 'common/verifiable';
import { ParallelScheduleParamsDto, ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from 'economic/model/parallel-schedule-params';

export class ParallelScheduleParamsStateHandler extends StateHandler<ParallelScheduleParamsState, ParallelScheduleParamsDto> {

    readonly dailyConsumptionHandler = new FloatStringStateHandler(0, 1e6, 2, false)

    fromDto(dto: ParallelScheduleParamsDto): ParallelScheduleParamsState {
        throw new Error('Method not implemented.');
    }

    toDto(state: ParallelScheduleParamsState): ParallelScheduleParamsDto {
        throw new Error('Method not implemented.');
    }

    validate(tgt: ParallelScheduleParamsState): Status {
        throw new Error('Method not implemented.');
    }

    create(kwargs: ParallelScheduleParamsKwArgs): ParallelScheduleParamsState {
        return {
            handle: this.cnt++,
            oldComputaion: kwargs.oldComputaion ?? null,
            newComputation: kwargs.newComputation ?? null,
            oldDailyConsumption: this.dailyConsumptionHandler.create(kwargs.newDailyConsumption?.toString()),
            newDailyConsumption: this.dailyConsumptionHandler.create(kwargs.oldDailyConsumption?.toString()),
            status: Status.Ok
        }
    }
}