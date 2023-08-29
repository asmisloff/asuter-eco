import { StringStateHandler, format } from 'common/StringStateHandler'
import { StringStateRecordHandler } from 'common/StringStateRecordHandler'
import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler'
import { IntStringStateHandler } from 'common/number-state-handler/IntStringStateHandler'
import { Status } from 'common/verifiable'
import { RatesState, RatesStateKwargs } from 'economic/model/rates'


/**
 * Контроллер для управления состоянием раздела "Экономические ставки".
 */
export class RatesStateHandler extends StringStateRecordHandler<RatesState, RatesStateKwargs> {

    readonly DEFAULT_REDUCED_ENERGY_CONSUMPTION = 0
    readonly DEFAULT_INCOME_TAX = 20.0
    readonly DEFAULT_PROPERTY_TAX = 2.2
    readonly DEFAULT_SOCIAL_TAX = 26
    readonly DEFAULT_DISCOUNT_RATE = 10.0
    readonly DEFAULT_ANNUAL_INFLATION_RATE = 5.0
    readonly DEFAULT_ANNUAL_SALARY_INDEXATION = 5.0
    readonly DEFAULT_ANNUAL_INCREASE_IN_ELECTRICITY_TARIFF = 5.0

    private rateHandler = new FloatStringStateHandler(0, 1e4, 2, true)
    private energyConsumptionHandler = new FloatStringStateHandler(-100, 50, 2, true)
    private electricityCostHandler = new FloatStringStateHandler(0, 1e3, 2, true)
    private reqHandler = new FloatStringStateHandler(0, 50, 2, true)
    private optHandler = new FloatStringStateHandler(0, 50, 2, false)
    private calcPeriodHandler = new IntStringStateHandler(1, 50, true)

    handlers: Record<keyof RatesStateKwargs, StringStateHandler | ((arg?: any) => any)> = {
        profitRateForCargoTurnover: this.rateHandler,
        spendingRateForEconomicTasks: this.rateHandler,
        reducedEnergyConsumption: this.energyConsumptionHandler,
        electricityCostPerTraction: this.electricityCostHandler,
        incomeTax: this.optHandler,
        propertyTax: this.optHandler,
        socialTax: this.optHandler,
        discountRate: this.reqHandler,
        annualInflationRate: this.reqHandler,
        annualSalaryIndexation: this.reqHandler,
        annualIncreaseInElectricityTariff: this.reqHandler,
        calculationPeriod: this.calcPeriodHandler
    }

    /** Рассчитать коэффициент дисконтирования (в долях единицы). */
    discountCoefficient(tgt: RatesState): string {
        if (tgt.discountRate.status < Status.Error) {
            const dr = tgt.discountRate.value !== ''
             ? this.reqHandler.parseNumber(tgt.discountRate.value)
             : this.DEFAULT_DISCOUNT_RATE
            return format(1.0 / (1.0 + 0.01 * dr), 3)
        }
        return ''
    }
}