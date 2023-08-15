import { Verifiable } from 'common/verifiable'
import { CapacityParamsDto, CapacityParamsState } from './capacity-params'
import { CapitalExpendituresTableState } from './capital-expenditures'
import { ParallelScheduleParamsState } from './parallel-schedule-params'
import { AdditionalExpendituresTableState } from './additional-expendures'
import { SalaryStateRow, SalaryStateTable } from './salary'
import { RatesState } from './taxes'

export interface MeasuresEffectivenessDto {
    capacity: CapacityParamsDto
}

export interface MeasuresEffectivenessState extends Verifiable {
    id?: number
    name: string
    track?: TrackParams
    capacity: CapacityParamsState
    parallelSchedule: ParallelScheduleParamsState
    capitalExpenditures: CapitalExpendituresTableState
    additionalExpenditures: AdditionalExpendituresTableState
    salary: SalaryStateTable
    rates: RatesState
}

export interface TrackParams {
    id: number
    name: string
    length: string
}