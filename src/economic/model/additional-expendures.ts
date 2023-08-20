import { StringState } from 'common/StringStateHandler'
import { Verifiable } from 'common/verifiable'
import { ExpenditureType } from './dto'

export interface AdditionalExpendituresRowDto {
    expendureItem: string,
    equipment: string,
    price: number,
    qty: number,
    period: ExpenditureType
}

export interface AdditionalExpendituresRowState extends Verifiable {
    expendureItem: StringState,
    equipment: StringState,
    price: StringState,
    qty: StringState,
    period: ExpenditureType
}

export interface AdditionalExpendituresTableState extends Verifiable {
    rows: AdditionalExpendituresRowState[]
}

export type AdditionalExpendituresRowKwArgs = Partial<{
    expendureItem: string,
    equipment: string,
    price: string | number,
    qty: string | number,
    period: ExpenditureType
}>