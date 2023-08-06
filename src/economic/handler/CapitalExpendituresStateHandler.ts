import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { IntStringStateHandler } from 'common/number-state-handler/IntStringStateHandler'
import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { StringStateTableHandler } from 'common/StringStateTableHandler'
import { StringStringStateHandler } from 'common/StringStringStateHandler'
import {CapitalExpendituresRowKwArgs, CapitalExpendituresRowState} from 'economic/model/capital-expenditures'

class RowHandler extends StringStateRecordHandler<CapitalExpendituresRowState, CapitalExpendituresRowKwArgs> {

    readonly handlers: Record<'equipment' | 'type' | 'price' | 'qty' | 'serviceLife', StringStateHandler | ((arg?: any) => any)> = {
        equipment: new StringStringStateHandler(5, 50),
        type: new StringStringStateHandler(0, 50),
        price: new FloatStringStateHandler(0, 10e6, 2, true),
        qty: new IntStringStateHandler(1, 1e3, true),
        serviceLife: new IntStringStateHandler(1, 100, true)
    }
}

export class CapitalExpendituresStateHandler extends StringStateTableHandler<CapitalExpendituresRowState, CapitalExpendituresRowKwArgs> {
    constructor() {
        super(new RowHandler())
    }
}