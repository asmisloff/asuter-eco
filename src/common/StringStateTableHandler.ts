import { StringState } from './StringStateHandler'
import { StringStateRecordHandler } from './StringStateRecordHandler'
import { StateHandler, Status, Verifiable } from './verifiable'

export interface StringStateTable<R extends Verifiable> extends Verifiable {
    rows: R[]
}

export class StringStateTableHandler<R extends Verifiable, K extends Record<string, any>> extends StateHandler<StringStateTable<R>> {

    private rowHandler: StringStateRecordHandler<R, K>

    constructor(rowHandler: StringStateRecordHandler<R, K>) {
        super()
        this.rowHandler = rowHandler
    }

    validate(tgt: StringStateTable<R>): Status {
        this.reset(tgt)
        for (const row of tgt.rows) {
            this.transferStatus(tgt, row)
        }
        return tgt.status
    }

    createDefault(): StringStateTable<R> {
        const instance = {
            handle: StateHandler.cnt++,
            status: Status.Ok,
            rows: []
        }
        this.validate(instance)
        return instance
    }

    insertRow(tgt: StringStateTable<R>, idx: number, kwargs: K): R {
        const row = this.rowHandler.create(kwargs)
        tgt.rows.splice(idx, 0, row)
        tgt.rows = tgt.rows.slice()
        this.validate(tgt)
        return row
    }

    duplicateRow(tgt: StringStateTable<R>, idx: number): R {
        const row = tgt.rows[idx]
        const kw = {} as any
        for (const key in this.rowHandler.handlers) {
            const value = (row as any)[key]
            if (value.handle !== undefined) {
                kw[key] = (value as StringState).value
            } else {
                kw[key] = value
            }
        }
        const copy = this.rowHandler.create(kw)
        tgt.rows.splice(idx, 0, copy)
        tgt.rows = tgt.rows.slice()
        this.validate(tgt)
        return copy
    }

    updateRow(tgt: StringStateTable<R>, idx: number, kwargs: K) {
        const row = tgt.rows[idx]
        this.rowHandler.update(row, kwargs)
        this.validate(tgt)
    }

    deleteRow(tgt: StringStateTable<R>, idx: number) {
        tgt.rows.splice(idx, 1)
        tgt.rows = tgt.rows.slice()
        this.validate(tgt)
    }
}