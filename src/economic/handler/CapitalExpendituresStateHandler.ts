import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { IntStringStateHandler } from 'common/number-state-handler/IntStringStateHandler'
import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { StringStateTableHandler } from 'common/StringStateTableHandler'
import { StringStringStateHandler } from 'common/StringStringStateHandler'
import {CapitalExpendituresRowKwargs, CapitalExpendituresRowState} from 'economic/model/capital-expenditures'

class RowHandler extends StringStateRecordHandler<CapitalExpendituresRowState, CapitalExpendituresRowKwargs> {

    readonly handlers: Record<keyof CapitalExpendituresRowKwargs, StringStateHandler | ((arg?: any) => any)> = {
        equipment: new StringStringStateHandler(1, 50),
        type: new StringStringStateHandler(0, 50),
        price: new FloatStringStateHandler(1, 100e6, 2, true),
        qty: new FloatStringStateHandler(1, 1e3, 2, true),
        serviceLife: new IntStringStateHandler(1, 100, true)
    }
}

/**
 * Контроллер для управления состоянием раздела "Капитальные затраты".
 */
export class CapitalExpendituresStateHandler extends StringStateTableHandler<CapitalExpendituresRowState, CapitalExpendituresRowKwargs> {
    constructor() {
        super(new RowHandler())
    }
}