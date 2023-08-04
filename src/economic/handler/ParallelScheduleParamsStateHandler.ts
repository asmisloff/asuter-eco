import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { StateHandler, Status } from 'common/verifiable'
import { DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH } from 'economic/const'
import { ParallelScheduleInfo, ParallelScheduleParamsDto, ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from 'economic/model/parallel-schedule-params'

export class ParallelScheduleParamsStateHandler extends StateHandler<ParallelScheduleParamsState, ParallelScheduleParamsDto> {

    readonly dcHandler = new FloatStringStateHandler(0, 1e6, 3, false)

    fromDto(dto: ParallelScheduleParamsDto): ParallelScheduleParamsState {
        return this.create(dto)
    }

    toDto(state: ParallelScheduleParamsState): ParallelScheduleParamsDto {
        throw new Error('Method not implemented.')
    }

    validate(tgt: ParallelScheduleParamsState): Status {
        this.reset(tgt)

        if (tgt.oldComputation === null) {
            this.dcHandler.checkIsNotBlank(tgt.oldDailyConsumption)
        } else if (tgt.oldDailyConsumption.value !== '' && !this.dcHandler.equal(tgt.oldDailyConsumption, this.defaultDailyConsumption(tgt.oldComputation))) {
            this.dcHandler.addWarning(tgt.oldDailyConsumption, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
        }

        if (tgt.newComputation === null) {
            this.dcHandler.checkIsNotBlank(tgt.newDailyConsumption)
        } else if (tgt.newDailyConsumption.value !== '' && !this.dcHandler.equal(tgt.newDailyConsumption, this.defaultDailyConsumption(tgt.newComputation))) {
            this.dcHandler.addWarning(tgt.newDailyConsumption, DEFAULT_AND_ACTUAL_VALUES_DONT_MATCH)
        }

        this.transferStatus(tgt, tgt.oldDailyConsumption)
        this.transferStatus(tgt, tgt.newDailyConsumption)
        return tgt.status
    }

    create(kwargs: ParallelScheduleParamsKwArgs): ParallelScheduleParamsState {
        const instance = {
            handle: this.cnt++,
            oldComputation: kwargs.oldComputation ?? null,
            newComputation: kwargs.newComputation ?? null,
            oldDailyConsumption: this.dcHandler.create(kwargs.newDailyConsumption?.toString()),
            newDailyConsumption: this.dcHandler.create(kwargs.oldDailyConsumption?.toString()),
            status: Status.Ok
        }
        this.validate(instance)
        return instance
    }

    update(tgt: ParallelScheduleParamsState, kwargs: ParallelScheduleParamsKwArgs) {
        tgt.oldDailyConsumption = this.dcHandler.createOrDefault(kwargs.oldDailyConsumption?.toString(), tgt.oldDailyConsumption)
        tgt.newDailyConsumption = this.dcHandler.createOrDefault(kwargs.newDailyConsumption?.toString(), tgt.newDailyConsumption)
        if (kwargs.oldComputation !== undefined) {
            tgt.oldComputation = kwargs.oldComputation
            tgt.oldDailyConsumption = this.dcHandler.copy(tgt.oldDailyConsumption)
        }
        if (kwargs.newComputation !== undefined) {
            tgt.newComputation = kwargs.newComputation
            tgt.newDailyConsumption = this.dcHandler.copy(tgt.newDailyConsumption)
        }
        this.validate(tgt)
    }

    defaultDailyConsumption(schInfo: ParallelScheduleInfo | null): string {
        if (schInfo) {
            return this.dcHandler.normalized((schInfo.consumption * 1440 / schInfo.duration).toString())
        }
        return ''
    }
}