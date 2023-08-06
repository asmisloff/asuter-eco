import { StringStateHandler } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { StringStringStateHandler } from 'common/StringStringStateHandler'
import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { IntStringStateHandler } from 'common/number-state-handler/IntStringStateHandler'
import { SalaryStateRow, SalaryStateKw } from 'economic/model/salary'

export class SalaryRowStateHandler extends StringStateRecordHandler<SalaryStateRow, SalaryStateKw> {

    handlers: Record<keyof SalaryStateKw, StringStateHandler | ((arg?: any) => any)> = {
        employee: new StringStringStateHandler(5, 50),
        equipment: new StringStringStateHandler(0, 50),
        qty: new IntStringStateHandler(1, 100, true),
        hourlyRate: new FloatStringStateHandler(1, 1e4, 2, true),
        annualOutput: new IntStringStateHandler(1, 1e4, true),
        motivation: new FloatStringStateHandler(0, 100, 2, true),
    }
}
