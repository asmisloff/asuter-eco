import { NOT_A_NUMBER, VALUE_IS_REQUIRED, NUMERIC_RANGE_VIOLATION } from 'economic/std-messages'
import { StateHandler, Status, Verifiable } from './verifiable'

/** Верефицируемое строковое состояние. */
export interface StringState extends Verifiable {
    value: string
}

export function isBlank(s: string): boolean {
    return s.trim().length === 0
}

/**
 * Определяет интерфейс и общую логику для управления верифицируемым строковым состоянием.
 */
export abstract class StringStateHandler extends StateHandler<StringState> {

    /**
     * Создать копию управляемого объекта.
     * @param tgt целевой объект.
     * @param value значение. Если не задано, значение берется из целевого объекта.
     */
    copy(tgt: StringState, value?: string): StringState {
        return this.create(value != null ? value : tgt.value)
    }

    /**
     * Создать новый объект StringState.
     * @param value хранимое строковое значение.
     */
    create(value?: string): StringState {
        const instance = {
            handle: StateHandler.cnt++,
            value: this.normalized(value),
            status: Status.Ok
        } as StringState
        this.validate(instance)
        return instance
    }

    createOrDefault(newValue: string | undefined, _default: StringState): StringState {
        if (newValue != null && newValue !== _default.value) {
            const newInstance = {
                handle: StateHandler.cnt++,
                value: this.normalized(newValue),
                status: Status.Ok
            } as StringState
            this.validate(newInstance)
            return newInstance
        }
        return _default
    }

    abstract validate(tgt: StringState): Status

    /** Проверить, приводится ли хранимое значение к действительному числу. */
    checkIsNumber(tgt: StringState): number {
        const numberValue = this.parseNumber(tgt.value)
        if (isNaN(numberValue)) {
            this.addError(tgt, NOT_A_NUMBER)
        }
        return numberValue
    }

    /** Проверить, приводится ли хранимое значение к действительному числу. */
    checkIsNumberOrBlank(tgt: StringState): number {
        const stringValue = tgt.value
        const numberValue = this.parseNumber(stringValue)
        if (isNaN(numberValue)) {
            this.addError(tgt, NOT_A_NUMBER)
        }
        return numberValue
    }

    checkIsNotBlank(tgt: StringState): boolean {
        const blank = isBlank(tgt.value)
        if (blank) {
            this.addError(tgt, VALUE_IS_REQUIRED)
        }
        return !blank
    }

    /**
     * Проверить, лежит ли хранимое значение в заданном диапазоне чисел (включительно для обеих границ).
     * @param tgt целевой объект.
     * @param value хранимое значение или число, к которому оно приводится.
     * @param min минимальное значение.
     * @param max максимальное значение.
     */
    checkInRange(
        tgt: StringState,
        value: string | number,
        min: number,
        max: number
    ) {
        const numberValue = typeof value === 'number' ? value : this.parseNumber(value)
        return this.check(
            tgt,
            numberValue >= min && numberValue <= max,
            Status.Error,
            `${NUMERIC_RANGE_VIOLATION} [${min}...${max}]`
        )
    }

    /**
     *
     * @param tgt целевой объект
     * @param value хранимое значение или число, к которому оно приводится.
     */
    checkIsInteger(tgt: StringState, value: number | string) {
        const numberValue = typeof value === 'number' ? value : this.parseNumber(value)
        return this.check(
            tgt,
            Number.isInteger(numberValue),
            Status.Error,
            NOT_A_NUMBER
        )
    }

    abstract normalized(s?: string): string
}

export function format(
    v: string | number | null | undefined,
    maxFractionDigits?: number,
    minFractionDigits?: number,
    defaultValue: string = '-',
    signDisplay: 'auto' | 'always' | 'exceptZero' | 'never' | undefined = 'auto' // todo: 'negative' по умолчанию, убрать deleteMinusIfNegativeZero
): string {

    /**
     * Удалить знак '-', если в строке-аргументе записан отрицательный ноль.
     * 
     *  - TODO (30 авг. 2023 г.):
     *      Intl.NumberFormat может принимать для параметра signDisplay значение 'negative'.
     *      Эта опция решает проблему с отрицательным нулем, но она относительно новая и
     *      слабо поддерживается браузерами.
     */
    function deleteMinusIfNegativeZero(s: string): string {
        if (s.length >= 2 && s[0] === '-' && s[1] === '0') {
        for (let i = 2; i < s.length; ++i) {
            if (s[i] >= '1' && s[i] <= '9') {
            return s
            }
        }
        return s.substring(1, s.length)
        }
        return s
    }

    if (v == null) {
        return defaultValue
    }
    const options = { maximumFractionDigits: maxFractionDigits, minimumFractionDigits: minFractionDigits, signDisplay: signDisplay }
    if (typeof v === 'object') { // Complex
        const c = v as { re: number, im: number }
        const re = deleteMinusIfNegativeZero(c.re.toLocaleString('ru', options))
        let im = deleteMinusIfNegativeZero(c.im.toLocaleString('ru', options))
        if (Math.sign(c.im) >= 0) im = `+${im}`
        return `${re}${im}j`
    }
    return deleteMinusIfNegativeZero((+v).toLocaleString('ru', options))
}

export function localized(
    s: string,
    maxFractionDigits?: number,
    minFractionDigits?: number
): string {
    return s.replace(/[-]?\d+[.]?\d+/g, (substr) => format(substr, maxFractionDigits, minFractionDigits))
}
