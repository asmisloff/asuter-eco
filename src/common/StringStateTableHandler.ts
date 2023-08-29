import { StringState } from './StringStateHandler'
import { StringStateRecordHandler } from './StringStateRecordHandler'
import { StateHandler, Status, Verifiable } from './verifiable'

/**
 * Верифицируцируемое состояние таблицы. В базовом сценарии предполагается, что строки таблицы - верифицируемые записи (см. StringStateRecordHandler).
 */
export interface StringStateTable<R extends Verifiable> extends Verifiable {
    /** Строки таблицы. */
    rows: R[]
}

/**
 * Контроллер для управления верифицируемой таблицей.
 *  - R - тип строки таблицы.
 *  - K - kwargs для строки таблицы (подробнее см. StringStateRecordHandler).
 */
export class StringStateTableHandler<R extends Verifiable, K extends Record<string, any>> extends StateHandler<StringStateTable<R>> {

    /** Контроллер для управления состоянием строк таблицы. */
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

    /** Создать пустую таблицу. */
    createDefault(): StringStateTable<R> {
        const instance = {
            handle: StateHandler.cnt++,
            status: Status.Ok,
            rows: []
        }
        this.validate(instance)
        return instance
    }

    /**
     * Вставить новую строку в таблицу. Метод копирует массив rows.
     * @param tgt целевая таблица.
     * @param idx индекс для вставки строки.
     * @param kwargs значения полей новой строки.
     * @returns вновь созданная строка.
     */
    insertRow(tgt: StringStateTable<R>, idx: number | null, kwargs: K): R {
        const row = this.rowHandler.create(kwargs)
        if (idx === null) {
            idx = tgt.rows.length
        }
        if (idx < 0) {
            idx += tgt.rows.length
        }
        tgt.rows.splice(idx, 0, row)
        tgt.rows = tgt.rows.slice()
        this.validate(tgt)
        return row
    }

    /**
     * Вставить в таблицу копию строки. Метод копирует массив rows.
     * @param tgt целевая таблица.
     * @param idx индекс копируемой строки. Строка-копия вставляется в массив строк сразу после оригинала.
     * @returns вновь созданная строка.
     */
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

    /**
     * Модифицировать строку таблицы. Метод не обновляет ссылку на массив rows.
     * Обновится ли сама строка определяется реализацией контроллера строк (this.rowHandler).
     * @param tgt целевая таблица.
     * @param idx индекс изменяемой строки.
     * @param kwargs новые значения полей.
     */
    updateRow(tgt: StringStateTable<R>, idx: number, kwargs: K) {
        const row = tgt.rows[idx]
        tgt.rows[idx] = this.rowHandler.update(row, kwargs)
        this.validate(tgt)
    }

    /**
     * Удалить строку из таблицы. Метод копирует массив rows.
     * @param tgt целевая таблица.
     * @param idx индекс удаляемой строки.
     */
    deleteRow(tgt: StringStateTable<R>, idx: number) {
        tgt.rows.splice(idx, 1)
        tgt.rows = tgt.rows.slice()
        this.validate(tgt)
    }
}