export const VALUE_IS_REQUIRED = 'Поле обязательно для заполнения'
export const ANY_REQUIRED_VALUES_ARE_MISSED = 'Не все обязательные значения введены'

export const NUMERIC_RANGE_VIOLATION = 'Значение должно находиться в пределах'
export const ANY_NUMERIC_VALUES_ARE_OUT_OF_RANGE = 'Значения некоторых числовых полей не соответствуют ограничениям'

export const NOT_A_NUMBER = 'Значение должно быть числом'
export const ANY_NUMBERS_ARE_NOT_NUMBERS = 'Значения в некоторых числовых полях не удалось распознать как числа'

export const MAX_SYMBOL_QTY = 'Количество символов должно находиться в пределах'
export const ANY_STRINGS_HAVE_WRONG_LENGTH = 'Длины некоторых строк не соответствуют ограничениям'

export const DEFAULT_AND_ACTUAL_VALUES_MISMATCH = 'Уведомление: введенное значение не совпадает со значением по умолчанию'

export function illegalNumberPrecisionMsg(expected: number): string {
    if (expected < 0) {
        throw new Error('Количество знаков после зяпятой не может быть отрицательным числом')
    }
    if (expected === 0) {
        return 'Должно быть целым числом'
    }
    const digits = expected === 1 ? 'знака' : 'знаков'
    return `Допсукается не более ${expected.toFixed()} ${digits} после десятичной запятой`;
}