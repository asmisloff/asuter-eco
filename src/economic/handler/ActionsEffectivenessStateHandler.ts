import { CapacityParamsStateHandler } from 'economic/handler/CapacityParamsStateHandler'
import { StateHandler, Status } from '../../common/verifiable'
import { CapacityParamsKw, CapacityParamsState } from '../model/capacity-params'
import { ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from '../model/parallel-schedule-params'
import { ParallelScheduleParamsStateHandler } from 'economic/handler/ParallelScheduleParamsStateHandler'
import { CapitalExpendituresRowKwArgs, CapitalExpendituresRowState } from '../model/capital-expenditures'
import { CapitalExpendituresStateHandler } from 'economic/handler/CapitalExpendituresStateHandler'
import { EfficiencyComputationState, TrackParams } from 'economic/model/measure-effectiveness'
import { AdditionalExpendituresStateHandler } from './AdditionalExpenduresStateHandler'
import { AdditionalExpendituresRowKwArgs } from 'economic/model/additional-expendures'
import { StringStateTableHandler } from 'common/StringStateTableHandler'
import { SalaryRowStateHandler } from './SalaryStateHandler'
import { SalaryStateKw } from 'economic/model/salary'
import { StringState, format } from 'common/StringStateHandler'
import { RatesHandler } from './RatesHandler'
import { RatesStateKw } from 'economic/model/taxes'
import { EfficiencyComputationDto } from 'economic/model/dto'

export class EfficiencyComputationStateHandler extends StateHandler<EfficiencyComputationState> {

  private static _instance?: EfficiencyComputationStateHandler = undefined
  readonly capacityHandler = new CapacityParamsStateHandler()
  readonly parSchHandler = new ParallelScheduleParamsStateHandler()
  private capitalExpendituresHandler = new CapitalExpendituresStateHandler()
  private additionalExpendituresHandler = new AdditionalExpendituresStateHandler()
  private salaryHandler = new StringStateTableHandler(new SalaryRowStateHandler())
  readonly ratesHandler = new RatesHandler()

  private constructor() {
    super()
  }

  static getInstance(): EfficiencyComputationStateHandler {
    if (!EfficiencyComputationStateHandler._instance) {
      EfficiencyComputationStateHandler._instance = new EfficiencyComputationStateHandler()
    }
    return EfficiencyComputationStateHandler._instance
  }

  fromDto(dto: EfficiencyComputationDto): EfficiencyComputationState {
    throw new Error('Method not implemented.')
  }

  toDto(state: EfficiencyComputationState): EfficiencyComputationDto {
    throw new Error('Method not implemented.')
  }

  validate(tgt: EfficiencyComputationState): Status {
    this.reset(tgt)
    this.check(tgt, tgt.track !== undefined, Status.Error, 'Необходимо выбрать участок')
    this.checkEquipmentNames(tgt, tgt.additionalExpenditures.rows)
    this.checkEquipmentNames(tgt, tgt.salary.rows)
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
      name: '',
      track: undefined,
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

  powerDiff(tgt: ParallelScheduleParamsState): { abs: string, rel: string } {
    if (tgt.status < Status.Error) {
      let _old: number = 0
      if (tgt.oldDailyConsumption.value !== '') {
        _old = this.parSchHandler.dcHandler.parseNumber(tgt.oldDailyConsumption.value)
      } else {
        _old = tgt.oldComputation!.consumption * 1440 / tgt.oldComputation!.duration
      }

      let _new: number = 0
      if (tgt.newDailyConsumption.value !== '') {
        _new = this.parSchHandler.dcHandler.parseNumber(tgt.newDailyConsumption.value)
      } else {
        _new = tgt.newComputation!.consumption * 1440 / tgt.newComputation!.duration
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
        _old = tgt.oldCapacityInfo!.interval
      }

      let _new: number = 0
      if (tgt.newInterval.value !== '') {
        _new = this.parSchHandler.dcHandler.parseNumber(tgt.newInterval.value)
      } else {
        _new = tgt.newCapacityInfo!.interval
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
        _old = tgt.oldCapacityInfo!.trainQty
      }

      let _new: number = 0
      if (tgt.newTrainQty.value !== '') {
        _new = this.parSchHandler.dcHandler.parseNumber(tgt.newTrainQty.value)
      } else {
        _new = tgt.newCapacityInfo!.trainQty
      }

      return {
        abs: format(_new - _old, 0, 0, '', 'always'),
        rel: format(100 * (_new - _old) / _old, 2, 0, '', 'always') + ' %'
      }
    }
    return { abs: '', rel: '' }
  }

  updateTrack(tgt: EfficiencyComputationState, trackParams: TrackParams) {
    if (trackParams.id !== tgt.track?.id) {
      this.updateParallelScheduleParams(tgt, { oldComputation: null, newComputation: null })
      this.updateCapacityParams(tgt, { oldCapacityInfo: null, newCapacityInfo: null })
    }
    tgt.track = trackParams
    this.validate(tgt)
  }

  updateCapacityParams(tgt: EfficiencyComputationState, kwargs: CapacityParamsKw) {
    if (kwargs.oldCapacityInfo?.schemaId !== tgt.capacity.oldCapacityInfo?.schemaId) {
      this.updateParallelScheduleParams(tgt, { oldComputation: null })
    }
    if (kwargs.newCapacityInfo?.schemaId !== tgt.capacity.newCapacityInfo?.schemaId) {
      this.updateParallelScheduleParams(tgt, { newComputation: null })
    }
    this.capacityHandler.update(tgt.capacity, kwargs)
    this.validate(tgt)
  }

  updateParallelScheduleParams(tgt: EfficiencyComputationState, kwargs: ParallelScheduleParamsKwArgs) {
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
