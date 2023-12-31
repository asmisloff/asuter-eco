import { StringState, StringStateHandler } from 'common/StringStateHandler'
import { Status } from 'common/verifiable'
import { MAX_SYMBOL_QTY } from 'economic/std-messages'

/**
 * Контроллер для управления строковым состоянием как строкой.
 */
export class StringStringStateHandler extends StringStateHandler {

    private maxLength: number
    private minLength: number

    constructor(minLength: number, maxLength: number = 0) {
        super()
        this.maxLength = maxLength
        this.minLength = minLength
    }

    validate(tgt: StringState): Status {
        this.reset(tgt)
        if (tgt.value.length > this.maxLength || tgt.value.length < this.minLength) {
            this.addError(tgt, `${MAX_SYMBOL_QTY} [${this.minLength}...${this.maxLength}]`)
        }
        return tgt.status
    }

    normalized(s?: string | undefined): string {
        if (s == null) {
            return ''
        } else {
            return s.trim()
        }
    }
}