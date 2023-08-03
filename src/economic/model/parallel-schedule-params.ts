import { StringState } from 'common/StringStateHandler'
import { Verifiable } from 'common/verifiable'

interface ParallelScheduleInfo {
    id: number
    name: string
    consumption: number
    duration: number
}

export interface ParallelScheduleParamsState extends Verifiable {
    oldComputaion: ParallelScheduleInfo | null
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
