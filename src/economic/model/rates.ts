import { StringState } from 'common/StringStateHandler'
import { Verifiable } from 'common/verifiable'

export interface RatesState extends Verifiable {

    /** Доходная ставка за грузооборот, руб / 1000 т·км брутто */
    profitRateForCargoTurnover: StringState

    /** Расходная ставка для экономических задач, руб / 1000 т·км брутто */
    spendingRateForEconomicTasks: StringState

    /** Снижение энергопотребления благодаря проводимым мероприятиям, % */
    reducedEnergyConsumption: StringState

    /** Стоимость электроэнергии на тягу, руб / кВт·ч */
    electricityCostPerTraction: StringState

    /** Налог на прибыль, % */
    incomeTax: StringState

    /** Налог на имущество, % */
    propertyTax: StringState

    /** среднегодовая ставка социальных взносов, % */
    socialTax: StringState

    /** Ставка дисконтирования, % */
    discountRate: StringState

    /** Годовой темп инфляции, % */
    annualInflationRate: StringState

    /** Годовая индексация заработной платы, % */
    annualSalaryIndexation: StringState

    /** Годовой рост тарифа на электроэнергию, % */
    annualIncreaseInElectricityTariff: StringState

    /** Расчетный период, лет */
    calculationPeriod: StringState
}

export type RatesStateKwargs = Partial<{
    profitRateForCargoTurnover: string | number
    spendingRateForEconomicTasks: string | number
    reducedEnergyConsumption: string | number
    electricityCostPerTraction: string | number
    incomeTax: string | number
    propertyTax: string | number
    socialTax: string | number
    discountRate: string | number
    annualInflationRate: string | number
    annualSalaryIndexation: string | number
    annualIncreaseInElectricityTariff: string | number
    calculationPeriod: string | number
}>