import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { IntStringStateHandler } from 'common/number-state-handler/IntStringStateHandler'
import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { StringStateTableHandler } from 'common/StringStateTableHandler'
import { StringStringStateHandler } from 'common/StringStringStateHandler'
import { AdditionalExpendituresRowKwArgs, AdditionalExpendituresRowState } from 'economic/model/additional-expendures'

class RowHanler extends StringStateRecordHandler<AdditionalExpendituresRowState, AdditionalExpendituresRowKwArgs> {

    private expItemHandler = new StringStringStateHandler(0, 50)
    private equipmentHandler = new StringStringStateHandler(0, 50)
    private priceHandler = new FloatStringStateHandler(0, 10e6, 2, true)
    private qtyHandler = new IntStringStateHandler(1, 1e3, true)

    handlers: Record<'expendureItem' | 'equipment' | 'price' | 'qty' | 'period', StringStateHandler | ((arg?: any) => any)> = {
        expendureItem: this.expItemHandler,
        equipment: this.equipmentHandler,
        price: this.priceHandler,
        qty: this.qtyHandler,
        period: (s: 'OneTime' | 'Yearly' | undefined) => s === undefined ? 'Yearly' : s
    }
}

export class AdditionalExpendituresStateHandler extends StringStateTableHandler<AdditionalExpendituresRowState, AdditionalExpendituresRowKwArgs> {
    constructor() {
        super(new RowHanler())
    }
}