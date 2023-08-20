export interface EfficiencyComputationDto {
    id?: number
    name: string
    description: string
    trackId: number
    trackName: string
    trackLength: number
    capacityComputationBefore?: CapacityEconComputationDto
    capacityComputationAfter?: CapacityEconComputationDto
    parallelComputationBefore?: ParallelEconComputationDto
    parallelComputationAfter?: ParallelEconComputationDto
    inputData: EfficiencyInputDto
    result?: EfficiencyResult
}

/** Результат расчёта эффективности мероприятий по усилению устройств СТЖЭ. */
export interface EfficiencyResult {
    /** Повышение расхода энергии кВт·ч */
    increasingEnergyConsumption: number
    /** Повышение расхода энергии % */
    increasingEnergyConsumptionPercentage: number
    /** Достигаемое сокращение межпоездного интервала мин */
    reductionInTrainInterval: number
    /** Достигаемое сокращение межпоездного интервала % */
    reductionInTrainIntervalPercentage: number
    /** Достигаемое увеличение количества поездов шт */
    increaseInTrainQty: number
    /** Достигаемое увеличение количества поездов % */
    increaseInTrainQtyPercentage: number
    /** Результаты расчета по шагам */
    stepResults: Array<EfficiencyStepResult>
    /** Удельная стоимость достигаемого изменения межпоездного интервала руб / мин */
    costOfIntervalChangePerMinute: CostOfChange
    /** Удельная стоимость достигаемого изменения межпоездного интервала руб / % */
    costOfIntervalChangePerPercent: CostOfChange
    /** Удельная стоимость достигаемого изменения количества поездов руб / шт */
    costOfTrainsQtyChangePerTrain: CostOfChange
    /** Удельная стоимость достигаемого изменения количества поездов руб / % */
    costOfTrainsQtyChangePerPercent: CostOfChange
    /** Расчетный срок окупаемости лет */
    estimatedPaybackPeriod: number
    /** Расчетный дисконтированный срок окупаемости лет */
    estimatedDiscountedPaybackPeriod: number
}


/** Стоимость изменения */
export interface CostOfChange {
    /** Суммарные капиталовложения руб */
    capitalInvestment: number
    /** Годовые затраты за 1-й год руб */
    annualPaymentsFirst: number
    /** Годовые затраты за последний год руб */
    annualPaymentsLast: number
    /** Годовые затраты за весь срок руб */
    annualPaymentsAllYears: number
    /** Суммарные затраты руб */
    total?: number
}

/** Исходные данные из выбранного расчета пропускной способности по устройствам электроснабжения. */
export interface CapacityEconComputationDto {
    /** ID расчета */
    id: number
    /** Наименование расчета */
    name: string
    /** ID схемы */
    schemaId: number
    /** Масса поезда наибольшая т */
    trainWeightMaximum: number
    /** Межпоездной интервал мин */
    trainInterval: number
    /** Число поездов шт */
    trainQty: number
}

/**
* Исходные данные из выбранного расчета нагрузочной способности системы электроснабжения
* при параллельном графике движения.
*/
export interface ParallelEconComputationDto {
    /** ID расчета */
    id: number
    /** Наименование расчета */
    name: string
    /** ID схемы */
    schemaId: number
    /** Расход электроэнергии расчетный (значение берется из выбранного расчета) кВт·ч */
    energyConsumptionCalculated: number
    /** Продолжительность расчета (значение берется из выбранного расчета) мин */
    calculationDuration: number
    /** Расход энергии суточный кВт·ч */
    energyConsumption: number
}

/**
 * Исходные данные расчета вводимые пользователем вручную.
 */
export interface EfficiencyInputDto {
    trainWeightMaximum?: number
    trainIntervalBefore?: number
    trainIntervalAfter?: number
    trainQtyBefore?: number
    trainQtyAfter?: number
    energyConsumptionBefore?: number
    energyConsumptionAfter?: number
    capitalInvestments: Array<CapitalInvestmentsEntry>
    additionalExpenditures: Array<AdditionalExpendituresEntry>
    maintenanceSalaries: Array<MaintenanceSalariesEntry>
    profitOptions: ProfitCalculationOptions
    taxRates: TaxRates
    inflation: InflationRates
    calculationPeriod: number
}

/** Данные строки таблицы "Капитальные расходы". */
export interface CapitalInvestmentsEntry {
    /** Наименование оборудования */
    equipment: string
    /** Тип оборудования значение либо выбирается из каталогов либо отсутствует */
    equipmentType: string
    /** Стоимость руб/шт или руб/пог.км */
    price: number
    /** Количество шт. или длина км */
    amount: number
    /** Срок службы лет */
    serviceLife: number
}

/** Данные строки таблицы "Дополнительные расходы на мероприятия по усилению". */
export interface AdditionalExpendituresEntry {
    /** Наименование статьи расходов */
    name: string
    /** Наименование оборудования */
    equipment: string
    /** Количество шт. или длина км */
    amount: number
    /** Стоимость руб/шт или руб/пог.км */
    price: number
    /** Характер расходов */
    type: ExpenditureType
}

/** Данные строки таблицы "Дополнительные затраты на эксплуатацию". */
export interface MaintenanceSalariesEntry {
    /** Оплачиваемый работник */
    paidWorker: string
    /** Наименование оборудования */
    equipmentName: string
    /** Количество работников чел. */
    amount: number
    /** Часовая тарифная ставка руб/ч */
    hourlyRate: number
    /** Выработка чел·ч */
    productivity: number
    /** Дополнительные выплаты % */
    additionalPayments: number
}

/** Параметры расчета прибыли. */
export interface ProfitCalculationOptions {
    /** Доходная ставка за грузооборот руб / 1000 т·км брутто */
    profitRateForCargoTurnover: number
    /** Расходная ставка для экономических задач руб / 1000 т·км брутто */
    spendingRateForEconomicTasks: number
    /** Снижение энергопотребления благодаря проводимым мероприятиям % */
    reducedEnergyConsumption: number
    /** Стоимость электроэнергии на тягу руб / кВт·ч */
    electricityCostPerTraction: number
}

/** Налоговые ставки. */
export interface TaxRates {
    /** Налог на прибыль % */
    incomeTax: number
    /** Налог на имущество % */
    propertyTax: number
    /** Единый социальный налог % */
    unifiedSocialTax: number
}

/** Промежуточный результат вычисления на каждом шаге расчета. */
export interface EfficiencyStepResult {
    /** Шаг расчета */
    step: number
    /** Доход от грузооборота */
    cargoTurnoverRevenue: number
    /** Доход от снижения энергопотребления */
    reducedEnergyConsumptionIncome: number
    /** Инвестиционные затраты (присутствуют только на 0-м шаге) */
    investmentCosts: number[]
    /** Амортизационные отчисления */
    depreciation: number[]
    /** Затраты на электроэнергию */
    electricityCosts: number
    /** Дополнительные расходы единовременные (присутствуют только на 0-м шаге) */
    additionalOnetimeCosts: number[]
    /** Дополнительные расходы ежегодные */
    additionalAnnualCosts: number[]
    /** Оплата труда */
    salaries: number[]
    /** Налог на имущество */
    propertyTaxes: number[]
    /** Налог на прибыль */
    incomeTax: number
    /** Чистый доход */
    netIncome: number
    /** Чистый доход текущая сумма */
    netIncomeRunningSum: number
    /** Чистый доход дисконтированный */
    netIncomeDiscounted: number
    /** Чистый доход дисконтированный текущая сумма */
    netIncomeDiscountedRunningSum: number
}

/** Поля содержащие краткую информацию о расчете. */
export interface IEfficiencyComputationShortDto {
    id: number
    name: string
    description: string
    trackName: string
    schemaBeforeName: string
    schemaAfterName: string
    schemaBeforeType: string
    schemaAfterType: string
    changeTime: string
}

/** Инфляционные ставки. */
export interface InflationRates {
    /** Ставка дисконтирования % */
    discountRate: number
    /** Годовой темп инфляции % */
    annualInflationRate: number
    /** Годовая индексация заработной платы % */
    annualSalaryIndexation: number
    /** Годовой рост тарифа на электроэнергию % */
    annualIncreaseInElectricityTariff: number
}

/** Характер расходов. */
export type ExpenditureType = 
    | 'ONETIME' // Единовременные расходы
    | 'ANNUAL' // Ежегодные расходы

/** Отформатированные данные из промежуточного результата вычисления на каждом шаге расчета. */
export interface EfficiencyStepResultReportDto {
    /** Шаг расчета */
    step: number
    /** Доход от грузооборота */
    cargoTurnoverRevenue: number
    /** Доход от снижения энергопотребления */
    reducedEnergyConsumptionIncome: number
    /** Инвестиционные затраты */
    investmentCosts: number
    /** Амортизационные отчисления */
    depreciation: number
    /** Затраты на электроэнергию */
    electricityCosts: number
    /** Дополнительные расходы единовременные */
    additionalOnetimeCosts: number
    /** Дополнительные расходы ежегодные */
    additionalAnnualCosts: number
    /** Оплата труда */
    salaries: number
    /** Налог на имущество */
    propertyTaxes: number
    /** Налог на прибыль */
    incomeTax: number
    /** Чистый доход */
    netIncome: number
    /** Чистый доход текущая сумма */
    netIncomeRunningSum: number
    /** Чистый доход дисконтированный */
    netIncomeDiscounted: number
    /** Чистый доход дисконтированный текущая сумма */
    netIncomeDiscountedRunningSum: number
}

/** Отформатированные данные о стоимости изменения. */
export interface CostOfChangeReportDto {
    /** Суммарные капиталовложения руб */
    capitalInvestment: number
    /** Ежегодные выплаты за первый год руб */
    annualPaymentsFirst: number
    /** Ежегодные выплаты за последний год руб */
    annualPaymentsLast: number
    /** Ежегодные выплаты за весь срок руб */
    annualPaymentsAllYears: number
    /** Итого руб */
    total: number
}

/** Отформатированные данные строки таблицы "Дополнительные затраты на эксплуатацию". */
interface MaintenanceSalariesEntryReportDto {
    paidWorker: string
    equipmentName: string
    amount?: number
    hourlyRate?: number
    productivity?: number
    additionalPayments?: number
}

/** Отформатированные данные строки таблицы "Дополнительные расходы на мероприятия по усилению". */
export interface AdditionalExpendituresEntryReportDto {
    name: string
    equipment: string
    price?: number
    amount?: number
    type?: ExpenditureType
}

/** Отформатированные данные строки таблицы "Капитальные расходы". */
export interface CapitalInvestmentsEntryReportDto {
    /** Наименование оборудования */
    equipment: string
    /** Тип оборудования значение либо выбирается из каталогов либо отсутствует (пустая строка) */
    equipmentType: string
    price?: number
    /** Количество ед.изм. */
    amount?: number
    /** Срок службы лет */
    serviceLife?: number
}

/**
 * Все отформатированные данные для отображения на странице результата или в отчете
 * включая исходные данные и полные результаты расчета.
 * Все данные (включая данные в списках) должны иметь тип String или Int/Long с целью унификации форматирования.
 */
export interface EfficiencyFullDto {
    /** Идентификатор расчета */
    id?: number
    /** Наименование расчета */
    name: string
    /** Описание расчета */
    description: string
    /** Идентификатор участка */
    trackId: number
    /** Наименование участка */
    trackName: string
    /** Протяженность участка км */
    trackLength: string
    /** Координаты участка (от - до) км */
    trackCoordinates: string
    /** Наибольшая масса поезда т */
    trainWeightMaximum: string
    /** Наименование расчёта пропускной способности по устройствам электроснабжения (базовый) */
    capacityComputationBeforeName: string
    /** Наименование расчёта пропускной способности по устройствам электроснабжения (перспективный) */
    capacityComputationAfterName: string
    /** Наименование расчёта нагрузочной способности системы электроснабжения при параллельном графике движения (базовый) */
    parallelComputationBeforeName: string
    /** Наименование расчёта нагрузочной способности системы электроснабжения при параллельном графике движения (перспективный) */
    parallelComputationAfterName: string
    /** Межпоездной интервал (базовый) мин */
    trainIntervalBefore: string
    /** Межпоездной интервал (перспективный) мин */
    trainIntervalAfter: string
    /** Число поездов (базовый расчет) */
    trainQtyBefore: string
    /** Число поездов (перспективный расчет) */
    trainQtyAfter: string
    /** Cуточный расход электроэнергии (базовый расчет) кВт */
    energyConsumptionBefore: string
    /** Cуточный расход электроэнергии (перспективный расчет) кВт */
    energyConsumptionAfter: string
    /** Изменение межпоездного интервала мин */
    changeInTrainInterval: string
    /** Изменение межпоездного интервала % */
    changeInTrainIntervalPercentage: string
    /** Изменение количества поездов шт. */
    changeInTrainQty: string
    /** Изменение количества поездов % */
    changeInTrainQtyPercentage: string
    /** Изменение расхода электроэнергии кВт */
    changeInEnergyConsumption: string
    /** Изменение расхода электроэнергии % */
    changeInEnergyConsumptionPercentage: string
    /**  Таблица №1 - Капитальные расходы */
    capitalInvestments: Array<CapitalInvestmentsEntryReportDto>
    /** Таблица №2 - Дополнительные расходы на мероприятия по усилению */
    additionalExpenditures: Array<AdditionalExpendituresEntryReportDto>
    /** Таблица №3 - Расходы на оплату труда */
    maintenanceSalaries: Array<MaintenanceSalariesEntryReportDto>
    // Таблица №4 - Принятые экономические параметры
    /** Налог на прибыль % */
    incomeTax: string
    /** Налог на имущество % */
    propertyTax: string
    /** Единый социальный налог % */
    unifiedSocialTax: string
    /** Доходная ставка за грузооборот руб. / 1000 т⋅км брутто */
    profitRateForCargoTurnover: string
    /** Расходная ставка на экономические задачи руб. / 1000 т⋅км брутто */
    spendingRateForEconomicTasks: string
    /** Снижение энергопотребления благодаря проводимым мероприятиям % */
    reducedEnergyConsumption: string
    /** Стоимость электроэнергии на тягу руб. / кВт⋅ч */
    electricityCostPerTraction: string
    /** Ставка дисконтирования % */
    discountRate: string
    /** Коэффициент дисконтирования отн. ед */
    discountCoefficient: string
    /** Годовой темп инфляции % */
    annualInflationRate: string
    /** Годовая индексация заработной платы % */
    annualSalaryIndexation: string
    /** Годовой рост тарифа на электроэнергию % */
    annualIncreaseInElectricityTariff: string
    // Таблица 5 – Удельная стоимость сокращения межпоездного интервала и увеличения количества поездов
    /**
     * Удельная стоимость. Список должен содержать 4 элемента:
     * 0-й эл-т списка - Удельная стоимость изменения межпоездного интервала за -1 мин
     * 1-й эл-т списка - Удельная стоимость изменения межпоездного интервала за -1 %
     * 2-й эл-т списка - Удельная стоимость изменения количества поездов за +1
     * 3-й эл-т списка - Удельная стоимость изменения количества поездов за +1 %
     */
    costsOfChange: Array<CostOfChangeReportDto>
    /** Простой срок окупаемости лет */
    estimatedPaybackPeriod: string
    /** Дисконтированный срок окупаемости лет */
    estimatedDiscountedPaybackPeriod: string
    /** Таблица 6 – Технико-экономическое обоснование мероприятий (пошаговые результаты) */
    stepResults: Array<EfficiencyStepResultReportDto>
}
