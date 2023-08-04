import { StringState } from 'common/StringStateHandler'
import { Verifiable } from 'common/verifiable'

export interface AdditionalExpendituresRowDto {
    expendureItem: string,
    equipment: string,
    price: number,
    qty: number,
    period: 'OneTime' | 'Yearly'
}

export interface AdditionalExpendituresRowState extends Verifiable {
    expendureItem: StringState,
    equipment: string,
    price: StringState,
    qty: StringState,
    period: 'OneTime' | 'Yearly'
}

export interface AdditionalExpendituresTableState extends Verifiable {
    rows: AdditionalExpendituresRowState[]
}

export type AdditionalExpendituresRowKwArgs = Partial<{
    expendureItem: string,
    equipment: string,
    price: string | number,
    qty: string | number,
    period: 'OneTime' | 'Yearly'
}>