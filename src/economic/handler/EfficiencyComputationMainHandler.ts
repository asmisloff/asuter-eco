import { CapacityParamsStateHandler } from 'economic/handler/CapacityParamsStateHandler'
import { StateHandler, Status } from '../../common/verifiable'
import { CapacityParamsKw, CapacityParamsState } from '../model/capacity-params'
import { ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from '../model/parallel-schedule-params'
import { ParallelScheduleParamsStateHandler } from 'economic/handler/ParallelScheduleParamsStateHandler'
import { CapitalExpendituresRowKwArgs, CapitalExpendituresRowState } from '../model/capital-expenditures'
import { CapitalExpendituresStateHandler } from 'economic/handler/CapitalExpendituresStateHandler'
import { EfficiencyComputationState, TrackParams } from 'economic/model/efficiency-computation'
import { AdditionalExpendituresStateHandler } from './AdditionalExpenduresStateHandler'
import { AdditionalExpendituresRowKwArgs } from 'economic/model/additional-expendures'
import { StringStateTableHandler } from 'common/StringStateTableHandler'
import { SalaryRowStateHandler } from './SalaryStateHandler'
import { SalaryStateKw } from 'economic/model/salary'
import { StringState, StringStateHandler, format } from 'common/StringStateHandler'
import { RatesStateHandler } from './RatesStateHandler'
import { RatesStateKw } from 'economic/model/rates'
import { EfficiencyComputationDto, EfficiencyInputDto } from 'economic/model/dto'
import { StringStringStateHandler } from 'common/StringStringStateHandler'
import { ANY_REQUIRED_VALUES_ARE_MISSED, MAX_SYMBOL_QTY, VALUE_IS_REQUIRED, NUMERIC_RANGE_VIOLATION, ANY_NUMERIC_VALUES_ARE_OUT_OF_RANGE, ANY_STRINGS_HAVE_WRONG_LENGTH, NOT_A_NUMBER, ANY_NUMBERS_ARE_NOT_NUMBERS } from 'economic/const'

export class EfficiencyComputationMainHandler extends StateHandler<EfficiencyComputationState> {

  private static _instance?: EfficiencyComputationMainHandler = undefined
  readonly capacityHandler = new CapacityParamsStateHandler()
  readonly parSchHandler = new ParallelScheduleParamsStateHandler()
  private capitalExpendituresHandler = new CapitalExpendituresStateHandler()
  private additionalExpendituresHandler = new AdditionalExpendituresStateHandler()
  private salaryHandler = new StringStateTableHandler(new SalaryRowStateHandler())
  readonly ratesHandler = new RatesStateHandler()
  private nameHandler = new StringStringStateHandler(5, 50)
  private descriptionHandler = new StringStringStateHandler(0, 50)

  private constructor() {
    super()
  }

  static getInstance(): EfficiencyComputationMainHandler {
    if (!EfficiencyComputationMainHandler._instance) {
      EfficiencyComputationMainHandler._instance = new EfficiencyComputationMainHandler()
    }
    return EfficiencyComputationMainHandler._instance
  }

  toDto(state: EfficiencyComputationState): EfficiencyComputationDto {
    if (state.status > Status.Warning) {
      throw new Error(state.what?.join('\n'))
    }
    return {
      id: state.id,
      name: state.name.value,
      description: state.description.value,
      trackId: state.track!.id,
      trackName: state.track!.name,
      trackLength: state.track!.length,
      capacityComputationBefore: state.capacity.oldCapacityDto ?? undefined,
      capacityComputationAfter: state.capacity.newCapacityDto ?? undefined,
      parallelComputationBefore: state.parallelSchedule.oldComputation ?? undefined,
      parallelComputationAfter: state.parallelSchedule.newComputation ?? undefined,
      inputData: {
        trainWeightMaximum: this.tryParseNumber(state.capacity.maxTrainMass.value) ?? undefined,
        trainIntervalBefore: this.tryParseNumber(state.capacity.oldInterval.value) ?? undefined,
        trainIntervalAfter: this.tryParseNumber(state.capacity.newInterval.value) ?? undefined,
        trainQtyBefore: this.tryParseNumber(state.capacity.oldTrainQty.value) ?? undefined,
        trainQtyAfter: this.tryParseNumber(state.capacity.newTrainQty.value) ?? undefined,
        energyConsumptionBefore: this.tryParseNumber(
          state.parallelSchedule.oldDailyConsumption.value
        ) ?? undefined,
        energyConsumptionAfter: this.tryParseNumber(
          state.parallelSchedule.newDailyConsumption.value
        ) ?? undefined,
        capitalInvestments: state.capitalExpenditures.rows.map(r => {
          return {
            equipment: r.equipment.value,
            equipmentType: r.type.value,
            price: this.parseNumber(r.price.value),
            amount: this.parseNumber(r.qty.value),
            serviceLife: this.parseNumber(r.serviceLife.value)
          }
        }),
        additionalExpenditures: state.additionalExpenditures.rows.map(r => {
          return {
            name: r.expendureItem.value,
            equipment: r.equipment.value,
            amount: this.parseNumber(r.qty.value),
            price: this.parseNumber(r.price.value),
            type: r.period
          }
        }),
        maintenanceSalaries: state.salary.rows.map(r => {
          const hourlyRate = this.parseNumber(r.hourlyRate.value)
          return {
            paidWorker: r.employee.value,
            equipmentName: r.equipment.value,
            amount: this.parseNumber(r.qty.value),
            hourlyRate: hourlyRate,
            productivity: hourlyRate * 365,
            additionalPayments: this.parseNumber(r.motivation.value)
          }
        }),
        profitOptions: {
          profitRateForCargoTurnover: this.parseNumber(state.rates.profitRateForCargoTurnover.value),
          spendingRateForEconomicTasks: this.parseNumber(state.rates.spendingRateForEconomicTasks.value),
          reducedEnergyConsumption: this.parseNumber(state.rates.reducedEnergyConsumption.value),
          electricityCostPerTraction: this.parseNumber(state.rates.electricityCostPerTraction.value)
        },
        taxRates: {
          incomeTax: this.tryParseNumber(state.rates.incomeTax.value)
            ?? this.ratesHandler.DEFAULT_INCOME_TAX,
          propertyTax: this.tryParseNumber(state.rates.propertyTax.value)
            ?? this.ratesHandler.DEFAULT_PROPERTY_TAX,
          unifiedSocialTax: this.tryParseNumber(state.rates.unifiedSocialTax.value)
            ?? this.ratesHandler.DEFAULT_UNIFIED_SOCIAL_TAX
        },
        inflation: {
          discountRate: this.tryParseNumber(state.rates.discountRate.value)
            ?? this.ratesHandler.DEFAULT_DISCOUNT_RATE,
          annualInflationRate: this.tryParseNumber(state.rates.annualInflationRate.value)
            ?? this.ratesHandler.DEFAULT_ANNUAL_INFLATION_RATE,
          annualSalaryIndexation: this.tryParseNumber(state.rates.annualSalaryIndexation.value)
            ?? this.ratesHandler.DEFAULT_ANNUAL_SALARY_INDEXATION,
          annualIncreaseInElectricityTariff: this.tryParseNumber(state.rates.annualIncreaseInElectricityTariff.value)
            ?? this.ratesHandler.DEFAULT_ANNUAL_INCREASE_IN_ELECTRICITY_TARIFF
        },
        calculationPeriod: this.tryParseNumber(state.rates.calculationPeriod.value)
          ?? this.ratesHandler.DEFAULT_CALC_PERIOD
      }
    }
  }

  fromDto(dto: EfficiencyComputationDto): EfficiencyComputationState {
    const capitalExpenditures = this.capitalExpendituresHandler.createDefault()
    for (const row of dto.inputData.capitalInvestments) {
      this.capitalExpendituresHandler.insertRow(
        capitalExpenditures,
        null,
        {
          equipment: row.equipment,
          price: row.price,
          qty: row.amount,
          serviceLife: row.serviceLife,
          type: row.equipmentType
        }
      )
    }

    const additionalExpenditures = this.additionalExpendituresHandler.createDefault()
    for (const row of dto.inputData.additionalExpenditures) {
      this.additionalExpendituresHandler.insertRow(
        additionalExpenditures,
        null,
        {
          equipment: row.equipment,
          expendureItem: row.name,
          period: row.type,
          price: row.price,
          qty: row.amount
        }
      )
    }

    const salary = this.salaryHandler.createDefault()
    for (const row of dto.inputData.maintenanceSalaries) {
      this.salaryHandler.insertRow(
        salary,
        null,
        {
          employee: row.paidWorker,
          equipment: row.equipmentName,
          qty: row.amount,
          hourlyRate: row.hourlyRate,
          annualOutput: row.productivity,
          motivation: row.additionalPayments
        }
      )
    }

    const state: EfficiencyComputationState = {
      handle: StateHandler.cnt++,
      status: Status.Ok,
      id: dto.id,
      name: this.nameHandler.create(dto.name),
      description: this.descriptionHandler.create(dto.description),
      track: {
        id: dto.trackId,
        name: dto.trackName,
        length: dto.trackLength
      },
      capacity: this.capacityHandler.create({
        oldCapacityDto: dto.capacityComputationBefore,
        newCapacityDto: dto.capacityComputationAfter,
        maxTrainMass: dto.inputData.trainWeightMaximum?.toString(),
        oldInterval: dto.inputData.trainIntervalBefore?.toString(),
        newInterval: dto.inputData.trainIntervalAfter?.toString(),
        oldTrainQty: dto.inputData.trainQtyBefore?.toString(),
        newTrainQty: dto.inputData.trainQtyAfter?.toString()
      }),
      parallelSchedule: this.parSchHandler.create({
        oldComputation: dto.parallelComputationBefore,
        newComputation: dto.parallelComputationAfter,
        oldDailyConsumption: dto.inputData.energyConsumptionBefore?.toString(),
        newDailyConsumption: dto.inputData.energyConsumptionAfter?.toString()
      }),
      capitalExpenditures: capitalExpenditures,
      additionalExpenditures: additionalExpenditures,
      salary: salary,
      rates: this.ratesHandler.create({
        profitRateForCargoTurnover: dto.inputData.profitOptions.profitRateForCargoTurnover,
        spendingRateForEconomicTasks: dto.inputData.profitOptions.spendingRateForEconomicTasks,
        reducedEnergyConsumption: dto.inputData.profitOptions.reducedEnergyConsumption,
        electricityCostPerTraction: dto.inputData.profitOptions.electricityCostPerTraction,
        incomeTax: dto.inputData.taxRates.incomeTax,
        propertyTax: dto.inputData.taxRates.propertyTax,
        unifiedSocialTax: dto.inputData.taxRates.unifiedSocialTax,
        discountRate: dto.inputData.inflation.discountRate,
        annualInflationRate: dto.inputData.inflation.annualInflationRate,
        annualSalaryIndexation: dto.inputData.inflation.annualSalaryIndexation,
        annualIncreaseInElectricityTariff: dto.inputData.inflation.annualIncreaseInElectricityTariff,
        calculationPeriod: dto.inputData.calculationPeriod
      })
    }
    this.validate(state)
    return state
  }

  validate(tgt: EfficiencyComputationState): Status {
    this.reset(tgt)
    this.check(tgt, tgt.track !== null, Status.Error, 'Необходимо выбрать участок')
    this.check(
      tgt,
      tgt.capitalExpenditures.rows.length > 0 || tgt.additionalExpenditures.rows.length > 0 || tgt.salary.rows.length > 0,
      Status.Error,
      'Необходимо ввести хотя бы одну строку затрат'
    )
    this.checkEquipmentNames(tgt, tgt.additionalExpenditures.rows)
    this.checkEquipmentNames(tgt, tgt.salary.rows)
    this.transferStatus(tgt, tgt.name)
    this.transferStatus(tgt, tgt.description)
    this.transferStatus(tgt, tgt.capacity)
    this.transferStatus(tgt, tgt.parallelSchedule)
    this.transferStatus(tgt, tgt.capitalExpenditures)
    this.transferStatus(tgt, tgt.additionalExpenditures)
    this.transferStatus(tgt, tgt.salary)
    this.transferStatus(tgt, tgt.rates)
    return tgt.status
  }

  createDefault(): EfficiencyComputationState {
    const state: EfficiencyComputationState = {
      id: undefined,
      name: this.nameHandler.create(),
      description: this.descriptionHandler.create(),
      track: null,
      handle: StateHandler.cnt++,
      status: Status.Ok,
      capacity: this.capacityHandler.create({}),
      parallelSchedule: this.parSchHandler.create({}),
      capitalExpenditures: this.capitalExpendituresHandler.createDefault(),
      additionalExpenditures: this.additionalExpendituresHandler.createDefault(),
      salary: this.salaryHandler.createDefault(),
      rates: this.ratesHandler.create({})
    }
    this.validate(state)
    return state
  }

  logErrors(tgt: EfficiencyComputationState): string {
    const messages = tgt.what
      ?.map(msg => {
        if (msg === VALUE_IS_REQUIRED) {
          return ANY_REQUIRED_VALUES_ARE_MISSED
        } else if (msg.includes(MAX_SYMBOL_QTY)) {
          return ANY_STRINGS_HAVE_WRONG_LENGTH
        } else if (msg.includes(NUMERIC_RANGE_VIOLATION)) {
          return ANY_NUMERIC_VALUES_ARE_OUT_OF_RANGE
        } else if (msg.includes(NOT_A_NUMBER)) {
          return ANY_NUMBERS_ARE_NOT_NUMBERS
        }
        return msg
      }) ?? []
    return Array.from(new Set(messages)).sort()
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n')
  }

  powerDiff(tgt: ParallelScheduleParamsState): { abs: string, rel: string } {
    if (tgt.status < Status.Error) {
      let _old: number = 0
      if (tgt.oldDailyConsumption.value !== '') {
        _old = this.parSchHandler.dcHandler.parseNumber(tgt.oldDailyConsumption.value)
      } else {
        _old = tgt.oldComputation!.energyConsumption
      }

      let _new: number = 0
      if (tgt.newDailyConsumption.value !== '') {
        _new = this.parSchHandler.dcHandler.parseNumber(tgt.newDailyConsumption.value)
      } else {
        _new = tgt.newComputation!.energyConsumption
      }

      return {
        abs: format(_new - _old, 2, 0, '', 'always'),
        rel: format(100 * (_new - _old) / _old, 2, 0, '', 'always') + ' %'
      }
    }
    return { abs: '', rel: '' }
  }

  intervalDiff(tgt: CapacityParamsState): { abs: string, rel: string } {
    if (tgt.newInterval.status < Status.Error && tgt.oldInterval.status < Status.Error) {
      let _old: number = 0
      if (tgt.oldInterval.value !== '') {
        _old = this.parSchHandler.dcHandler.parseNumber(tgt.oldInterval.value)
      } else {
        _old = tgt.oldCapacityDto!.trainInterval
      }

      let _new: number = 0
      if (tgt.newInterval.value !== '') {
        _new = this.parSchHandler.dcHandler.parseNumber(tgt.newInterval.value)
      } else {
        _new = tgt.newCapacityDto!.trainInterval
      }

      return {
        abs: format(_new - _old, 0, 0, '', 'always'),
        rel: format(100 * (_new - _old) / _old, 2, 0, '', 'always') + ' %'
      }
    }
    return { abs: '', rel: '' }
  }

  trainQtyDiff(tgt: CapacityParamsState): { abs: string, rel: string } {
    if (tgt.newTrainQty.status < Status.Error && tgt.oldTrainQty.status < Status.Error) {
      let _old: number = 0
      if (tgt.oldTrainQty.value !== '') {
        _old = this.parSchHandler.dcHandler.parseNumber(tgt.oldTrainQty.value)
      } else {
        _old = tgt.oldCapacityDto!.trainQty
      }

      let _new: number = 0
      if (tgt.newTrainQty.value !== '') {
        _new = this.parSchHandler.dcHandler.parseNumber(tgt.newTrainQty.value)
      } else {
        _new = tgt.newCapacityDto!.trainQty
      }

      return {
        abs: format(_new - _old, 0, 0, '', 'always'),
        rel: format(100 * (_new - _old) / _old, 2, 0, '', 'always') + ' %'
      }
    }
    return { abs: '', rel: '' }
  }

  updateName(tgt: EfficiencyComputationState, name: string) {
    tgt.name = this.nameHandler.create(name)
    this.validate(tgt)
  }

  updateDescription(tgt: EfficiencyComputationState, description: string) {
    tgt.description = this.descriptionHandler.create(description)
    this.validate(tgt)
  }

  updateTrack(tgt: EfficiencyComputationState, trackParams: TrackParams | null) {
    if (trackParams?.id !== tgt.track?.id) {
      this.updateParallelScheduleParams(tgt, { oldComputation: null, newComputation: null })
      this.updateCapacityParams(tgt, { oldCapacityDto: null, newCapacityDto: null })
    }
    tgt.track = trackParams
    this.validate(tgt)
  }

  updateCapacityParams(tgt: EfficiencyComputationState, kwargs: CapacityParamsKw) {
    if ((kwargs.oldCapacityDto != null || kwargs.newCapacityDto != null) && tgt.track === null) {
      throw new Error('Попытка выбора расчета пропускной способности при невыбранном участке')
    }
    if (kwargs.oldCapacityDto !== undefined && kwargs.oldCapacityDto?.schemaId !== tgt.capacity.oldCapacityDto?.schemaId) {
      this.updateParallelScheduleParams(tgt, { oldComputation: null })
    }
    if (kwargs.newCapacityDto !== undefined && kwargs.newCapacityDto?.schemaId !== tgt.capacity.newCapacityDto?.schemaId) {
      this.updateParallelScheduleParams(tgt, { newComputation: null })
    }
    this.capacityHandler.update(tgt.capacity, kwargs)
    this.validate(tgt)
  }

  updateParallelScheduleParams(tgt: EfficiencyComputationState, kwargs: ParallelScheduleParamsKwArgs) {
    if (
      tgt.capacity.oldCapacityDto === null && kwargs.oldComputation != null ||
      tgt.capacity.newCapacityDto === null && kwargs.newComputation != null
    ) {
      throw new Error('Попытка выбрать расчет нагрузочной способности при невыбранном расчете пропускной способности')
    }
    this.parSchHandler.update(tgt.parallelSchedule, kwargs)
    this.validate(tgt)
  }

  updateCapitalExpendituresRow(tgt: EfficiencyComputationState, idx: number, kwargs: CapitalExpendituresRowKwArgs) {
    this.capitalExpendituresHandler.updateRow(tgt.capitalExpenditures, idx, kwargs)
    if (kwargs.equipment !== undefined) {
      this.checkEquipmentNames(tgt, tgt.additionalExpenditures.rows)
      this.checkEquipmentNames(tgt, tgt.salary.rows)
    }
    this.validate(tgt)
  }

  insertCapitalExpendituresRow(tgt: EfficiencyComputationState, idx: number) {
    this.capitalExpendituresHandler.insertRow(tgt.capitalExpenditures, idx, {})
    this.validate(tgt)
  }

  deleteCapitalExpendituresRow(tgt: EfficiencyComputationState, idx: number) {
    this.capitalExpendituresHandler.deleteRow(tgt.capitalExpenditures, idx)
    this.checkEquipmentNames(tgt, tgt.additionalExpenditures.rows)
    this.checkEquipmentNames(tgt, tgt.salary.rows)
    this.validate(tgt)
  }

  duplicateCapitalExpendituresRow(tgt: EfficiencyComputationState, idx: number) {
    this.capitalExpendituresHandler.duplicateRow(tgt.capitalExpenditures, idx)
    this.validate(tgt)
  }

  updateAdditionalExpendituresRow(tgt: EfficiencyComputationState, idx: number, kwargs: AdditionalExpendituresRowKwArgs) {
    this.additionalExpendituresHandler.updateRow(tgt.additionalExpenditures, idx, kwargs)
    this.validate(tgt)
  }

  insertAdditionalExpendituresRow(tgt: EfficiencyComputationState, idx: number) {
    const row = this.additionalExpendituresHandler.insertRow(tgt.additionalExpenditures, idx, {})
    this.checkEquipmentNames(tgt, [row])
    this.validate(tgt)
  }

  deleteAdditionalExpendituresRow(tgt: EfficiencyComputationState, idx: number) {
    this.additionalExpendituresHandler.deleteRow(tgt.additionalExpenditures, idx)
    this.validate(tgt)
  }

  duplicateAdditionalExpendituresRow(tgt: EfficiencyComputationState, idx: number) {
    const row = this.additionalExpendituresHandler.duplicateRow(tgt.additionalExpenditures, idx)
    this.checkEquipmentNames(tgt, [row])
    this.validate(tgt)
  }

  uniqueEquipmentNames(current: string, arr: CapitalExpendituresRowState[]): string[] {
    const names = arr.map(row => row.equipment.value)
    names.splice(0, 0, '')
    names.push(current)
    return Array.from(new Set(names))
  }

  insertSalaryRow(tgt: EfficiencyComputationState, idx: number) {
    const row = this.salaryHandler.insertRow(tgt.salary, idx, {})
    this.checkEquipmentNames(tgt, [row])
    this.validate(tgt)
  }

  updateSalaryRow(tgt: EfficiencyComputationState, idx: number, kwargs: SalaryStateKw) {
    this.salaryHandler.updateRow(tgt.salary, idx, kwargs)
    this.validate(tgt)
  }

  deleteSalaryRow(tgt: EfficiencyComputationState, idx: number) {
    this.salaryHandler.deleteRow(tgt.salary, idx)
    this.validate(tgt)
  }

  duplicateSalaryRow(tgt: EfficiencyComputationState, idx: number) {
    const row = this.salaryHandler.duplicateRow(tgt.salary, idx)
    this.checkEquipmentNames(tgt, [row])
    this.validate(tgt)
  }

  updateRates(tgt: EfficiencyComputationState, kwargs: RatesStateKw) {
    this.ratesHandler.update(tgt.rates, kwargs)
    this.validate(tgt)
  }

  private checkEquipmentNames(tgt: EfficiencyComputationState, dependentRows: { equipment: StringState }[]) {
    const equipmentNames = this.uniqueEquipmentNames('', tgt.capitalExpenditures.rows)
    for (const row of dependentRows) {
      this.reset(row.equipment)
      if (!equipmentNames.includes(row.equipment.value)) {
        this.addWarning(row.equipment, 'Необъявленное оборудование')
        this.transferStatus(tgt, row.equipment)
      }
    }
  }
}
