import { StringStateHandler } from './StringStateHandler'
import { StateHandler, Status, Verifiable } from './verifiable'

export abstract class StringStateRecordHandler<R extends Verifiable, K extends Record<string, any>> extends StateHandler<R> {

    protected abstract handlers: Record<keyof K, StringStateHandler | ((arg?: any) => any)>
    protected abstract keys: Array<keyof K>

    create(kwargs: K): R {
        const row = {} as any
        for (const key of this.keys) {
            const h = this.handlers[key]
            if (h instanceof StringStateHandler) {
                row[key] = h.create(kwargs[key])
            } else {
                row[key] = h(kwargs[key])
            }
        }
        row.handle = StateHandler.cnt++
        row.status = Status.Ok
        this.validate(row as R)
        return row as R
    }

    update(tgt: R, kwargs: K): R {
        const row = tgt as any
        for (const key of this.keys) {
            const newValue = kwargs[key]
            if (newValue !== undefined) {
                const h = this.handlers[key]
                if (h instanceof StringStateHandler) {
                    row[key] = h.create(kwargs[key])
                } else {
                    row[key] = h(kwargs[key])
                }
            }
        }
        this.validate(tgt)
        return tgt
    }

    validate(tgt: R): Status {
        this.reset(tgt)
        for (const key in tgt) {
            const field = tgt[key] as any
            if (typeof field === 'object' && field !== null && field.status !== undefined) {
                this.transferStatus(tgt, field as Verifiable)
            }
        }
        return tgt.status
    }
}