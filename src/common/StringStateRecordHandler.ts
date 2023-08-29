import { StringStateHandler } from './StringStateHandler'
import { StateHandler, Status, Verifiable } from './verifiable'

/**
 * Контроллер для управления записью (в форме объекта JS).
 * Параметры обобщения:
 *  - R - объект-запись, является верифицируемым состоянием (Verified).
 *  - K - объект kwargs, соответствующий R. Конкретно это означает, что:
 *      1. множество ключей K есть подмножество ключей R;
 *      2. для любого key преобразование K[key] -> R[key] существует и его оператор есть this.handlers[key].
 * 
 * Описанные выше условия должны быть соблюдены разработчиком подкласса.
 */
export abstract class StringStateRecordHandler<R extends Verifiable, K extends Record<string, any>> extends StateHandler<R> {

    /** Контроллеры для управления состояниями полей записи. */
    readonly abstract handlers: Record<keyof K, StringStateHandler | ((arg?: any) => any)>

    /** 
     * Создать новую запись с хранимыми значениями согласно объекту kwargs.
     * Если в kwargs отсутствует значение (kwargs[key] === undefined), применяется значение по умолчанию. 
     */
    create(kwargs: K): R {
        const row = {} as any
        for (const key in this.handlers) {
            const h = this.handlers[key]
            if (h instanceof StringStateHandler) {
                row[key] = h.create(kwargs[key]?.toString())
            } else {
                row[key] = h(kwargs[key])
            }
        }
        row.handle = StateHandler.cnt++
        row.status = Status.Ok
        this.validate(row as R)
        return row as R
    }

    /**
     * Изменить состояние записи.
     * @param tgt - целевая запись.
     * @param kwargs - новые значения изменяемых полей.
     * @returns целевой объект с обновленными полями.
     * 
     * Реализация по умолчанию не создает копию целевого объекта, а модифицирует и возвращает исходный экземпляр.
     * Изменяемые поля при этом заменяются новыми объектами.
     */
    update(tgt: R, kwargs: K): R {
        const row = tgt as any
        for (const key in this.handlers) {
            const newValue = kwargs[key]
            if (newValue !== undefined) {
                const h = this.handlers[key]
                if (h instanceof StringStateHandler) {
                    row[key] = h.create(kwargs[key]?.toString())
                } else {
                    row[key] = h(kwargs[key])
                }
            }
        }
        this.validate(tgt)
        return tgt
    }

    /**
     * Проверяет собственные инварианты всех Verifiable полей записи.
     * Статус записи есть худший из статусов полей, what записи содержит все уникальные элементы what полей.
     * @param tgt целевая запись.
     * @returns статус записи.
     */
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
