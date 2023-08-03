import { StringState } from 'common/StringStateHandler'
import { Verifiable } from 'common/verifiable'

export interface ParallelScheduleParamsState extends Verifiable {
    oldComputation: ParallelScheduleInfo | null
    newComputation: ParallelScheduleInfo | null
    oldDailyConsumption: StringState
    newDailyConsumption: StringState
}

export interface ParallelScheduleParamsDto {
    oldComputaion?: ParallelScheduleInfo
    newComputation?: ParallelScheduleInfo
    oldDailyConsumption?: number
    newDailyConsumption?: number
}

export interface ParallelScheduleParamsKwArgs {
    oldComputaion?: ParallelScheduleInfo
    newComputation?: ParallelScheduleInfo
    oldDailyConsumption?: number
    newDailyConsumption?: number
}

interface ParallelScheduleInfo {
    id: number
    name: string
    consumption: number
    duration: number
}
