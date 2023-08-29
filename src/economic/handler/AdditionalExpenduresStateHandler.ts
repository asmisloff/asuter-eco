import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { StringStateTableHandler } from 'common/StringStateTableHandler'
import { StringStringStateHandler } from 'common/StringStringStateHandler'
import { AdditionalExpendituresRowKwargs, AdditionalExpendituresRowState } from 'economic/model/additional-expendures'
import { ExpenditureType } from 'economic/model/dto'

class RowHanler extends StringStateRecordHandler<AdditionalExpendituresRowState, AdditionalExpendituresRowKwargs> {

    private expItemHandler = new StringStringStateHandler(1, 50)
    private equipmentHandler = new StringStringStateHandler(0, 50)
    private priceHandler = new FloatStringStateHandler(1, 10e6, 2, true)
    private qtyHandler = new FloatStringStateHandler(1, 1e3, 2, true)

    handlers: Record<keyof AdditionalExpendituresRowKwargs, StringStateHandler | ((arg?: any) => any)> = {
        expendureItem: this.expItemHandler,
        equipment: this.equipmentHandler,
        price: this.priceHandler,
        qty: this.qtyHandler,
        period: (s?: ExpenditureType) => s ?? 'ANNUAL'
    }
}

/**
 * Контроллер для управления состоянием раздела "Дополнительные затраты".
 */
export class AdditionalExpendituresStateHandler extends StringStateTableHandler<AdditionalExpendituresRowState, AdditionalExpendituresRowKwargs> {
    constructor() {
        super(new RowHanler())
    }
}