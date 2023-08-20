import { StringState } from 'common/StringStateHandler'
import { Verifiable } from 'common/verifiable'

export interface ParallelScheduleParamsState extends Verifiable {
    oldComputation: ParallelScheduleInfo | null
    newComputation: ParallelScheduleInfo | null
    oldDailyConsumption: StringState
    newDailyConsumption: StringState
}

export interface ParallelScheduleParamsKwArgs {
    oldComputation?: ParallelScheduleInfo | null
    newComputation?: ParallelScheduleInfo | null
    oldDailyConsumption?: string | number
    newDailyConsumption?: string | number
}

export interface ParallelScheduleInfo {
    id: number
    name: string
    consumption: number
    duration: number
}
