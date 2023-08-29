import { StringState } from 'common/StringStateHandler'
import { Verifiable } from 'common/verifiable'
import { ParallelEconComputationDto } from './dto'

export interface ParallelScheduleParamsState extends Verifiable {
    oldComputation: ParallelEconComputationDto | null
    newComputation: ParallelEconComputationDto | null
    oldDailyConsumption: StringState
    newDailyConsumption: StringState
}

export interface ParallelScheduleParamsKwargs {
    oldComputation?: ParallelEconComputationDto | null
    newComputation?: ParallelEconComputationDto | null
    oldDailyConsumption?: string
    newDailyConsumption?: string
}
