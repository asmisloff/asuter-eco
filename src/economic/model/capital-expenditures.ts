import { StringState } from 'common/StringStateHandler';
import { Verifiable } from 'common/verifiable';

export interface CapitalExpendituresRowDto {
    equipment: string,
    type: string,
    price: number,
    qty: number,
    serviceLife: number
}

export interface CapitalExpendituresRowState extends Verifiable {
    equipment: StringState,
    type: StringState,
    price: StringState,
    qty: StringState,
    serviceLife: StringState
}

export interface CapitalExpendituresTableState extends Verifiable {
    rows: CapitalExpendituresRowState[]
}

export type CapitalExpendituresRowKwArgs = Partial<{
    equipment: string,
    type: string,
    price: string | number,
    qty: string | number,
    serviceLife: string | number
}>