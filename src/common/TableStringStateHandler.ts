import { StringState, StringStateHandler } from './StringStateHandler'
import { StateHandler, Status, Verifiable } from './verifiable'

export type StringTableRowState = Record<string, StringState | string>

export interface StringTableState<R extends StringTableRowState> extends Verifiable {
    rowKeys: Array<keyof R>
    rows: R[]
}

export abstract class TableStringStateHandler<R extends StringTableRowState, D> extends StateHandler<StringTableState<R>> {
    
    protected rowCnt = Number.MIN_SAFE_INTEGER

    private handlers: Record<keyof R, StringStateHandler>

    constructor(cellHandlers: Record<keyof R, StringStateHandler>) {
        super()
        this.handlers = cellHandlers
    }

    createRow(tgt: StringTableState<R>, kwargs: Record<keyof R, string | number>): R {
        const row = {} as Record<keyof R, StringState>
        for (const key of tgt.rowKeys) {
            row[key] = this.handlers[key].create(kwargs[key]?.toString())
        }
        return row as R
    }
}