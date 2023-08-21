import { StringState } from 'common/StringStateHandler'
import { StringStateTable } from 'common/StringStateTableHandler'
import { Verifiable } from 'common/verifiable'

export interface SalaryStateTable extends StringStateTable<SalaryStateRow> { }

export interface SalaryStateRow extends Verifiable {
    employee: StringState,
    equipment: StringState,
    qty: StringState,
    hourlyRate: StringState,
    annualOutput: StringState,
    motivation: StringState
}

export interface SalaryStateKw {
    employee?: string,
    equipment?: string,
    qty?: string | number,
    hourlyRate?: string | number,
    annualOutput?: string | number,
    motivation?: string | number
}