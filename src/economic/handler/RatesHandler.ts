import { StringStateHandler, format } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { IntStringStateHandler } from 'common/number-state-handler/IntStringStateHandler'
import { Status } from 'common/verifiable'
import { RatesState, RatesStateKw } from 'economic/model/taxes'

export class RatesHandler extends StringStateRecordHandler<RatesState, RatesStateKw> {

    readonly DEFAULT_INCOME_TAX = 20.0
    readonly DEFAULT_PROPERTY_TAX = 2.2
    readonly DEFAULT_UNIFIED_SOCIAL_TAX = 30.4
    readonly DEFAULT_DISCOUNT_RATE = 10.0
    readonly DEFAULT_ANNUAL_INFLATION_RATE = 5.0
    readonly DEFAULT_ANNUAL_SALARY_INDEXATION = 5.0
    readonly DEFAULT_ANNUAL_INCREASE_IN_ELECTRICITY_TARIFF = 5.0
    readonly DEFAULT_CALC_PERIOD = 5

    private fReqHandler = new FloatStringStateHandler(0, 100, 2, true)
    private fOptHandler = new FloatStringStateHandler(0, 100, 2, false)
    private calcPeriodHandler = new IntStringStateHandler(1, 50, false)

    handlers: Record<
        | 'profitRateForCargoTurnover' | 'spendingRateForEconomicTasks' | 'reducedEnergyConsumption' | 'electricityCostPerTraction' | 'incomeTax'
        | 'propertyTax' | 'unifiedSocialTax' | 'discountRate' | 'annualInflationRate' | 'annualSalaryIndexation' | 'annualIncreaseInElectricityTariff'
        | 'calculationPeriod',
        StringStateHandler | ((arg?: any) => any)
    > = {
        profitRateForCargoTurnover: this.fReqHandler,
        spendingRateForEconomicTasks: this.fReqHandler,
        reducedEnergyConsumption: this.fReqHandler,
        electricityCostPerTraction: this.fReqHandler,
        incomeTax: this.fOptHandler,
        propertyTax: this.fOptHandler,
        unifiedSocialTax: this.fOptHandler,
        discountRate: this.fOptHandler,
        annualInflationRate: this.fOptHandler,
        annualSalaryIndexation: this.fOptHandler,
        annualIncreaseInElectricityTariff: this.fOptHandler,
        calculationPeriod: this.calcPeriodHandler
    }

    validate(tgt: RatesState): Status {
        this.fOptHandler.compareToDefault(tgt.incomeTax, this.DEFAULT_INCOME_TAX)
        this.fOptHandler.compareToDefault(tgt.propertyTax, this.DEFAULT_PROPERTY_TAX)
        this.fOptHandler.compareToDefault(tgt.unifiedSocialTax, this.DEFAULT_UNIFIED_SOCIAL_TAX)
        this.fOptHandler.compareToDefault(tgt.discountRate, this.DEFAULT_DISCOUNT_RATE)
        this.fOptHandler.compareToDefault(tgt.annualInflationRate, this.DEFAULT_ANNUAL_INFLATION_RATE)
        this.fOptHandler.compareToDefault(tgt.annualSalaryIndexation, this.DEFAULT_ANNUAL_SALARY_INDEXATION)
        this.fOptHandler.compareToDefault(tgt.annualIncreaseInElectricityTariff, this.DEFAULT_ANNUAL_INCREASE_IN_ELECTRICITY_TARIFF)
        this.calcPeriodHandler.compareToDefault(tgt.calculationPeriod, this.DEFAULT_CALC_PERIOD)

        super.validate(tgt)
        return tgt.status
    }

    discountCoefficient(tgt: RatesState): string {
        if (tgt.discountRate.status < Status.Error) {
            const dr = tgt.discountRate.value !== ''
             ? this.fOptHandler.parseNumber(tgt.discountRate.value)
             : this.DEFAULT_DISCOUNT_RATE
            return format(1.0 / (1.0 + 0.01 * dr), 3)
        }
        return ''
    }
}