import { CapacityParamsStateHandler } from 'economic/handler/CapacityParamsStateHandler'
import { StateHandler, Status } from '../../common/verifiable'
import { CapacityParamsKw } from '../model/capacity-params'
import { ParallelScheduleParamsKwArgs } from '../model/parallel-schedule-params'
import { ParallelScheduleParamsStateHandler } from 'economic/handler/ParallelScheduleParamsStateHandler'
import { CapitalExpendituresRowKwArgs, CapitalExpendituresRowState } from '../model/capital-expenditures'
import { CapitalExpendituresStateHandler } from 'economic/handler/CapitalExpendituresStateHandler'
import { MeasuresEffectivenessDto, MeasuresEffectivenessState } from 'economic/model/measure-effectiveness'
import { AdditionalExpendituresStateHandler } from './AdditionalExpenduresStateHandler'
import { AdditionalExpendituresRowKwArgs, AdditionalExpendituresRowState } from 'economic/model/additional-expendures'
import { StringStateTableHandler } from 'common/StringStateTableHandler'
import { SalaryRowStateHandler } from './SalaryStateHandler'
import { SalaryStateKw } from 'economic/model/salary'
import { StringState } from 'common/StringStateHandler'

export class EconomicStateHandler extends StateHandler<MeasuresEffectivenessState> {

  private static _instance?: EconomicStateHandler = undefined
  readonly capacityHandler = new CapacityParamsStateHandler()
  readonly parSchHandler = new ParallelScheduleParamsStateHandler()
  private capitalExpendituresHandler = new CapitalExpendituresStateHandler()
  private additionalExpendituresHandler = new AdditionalExpendituresStateHandler()
  private salaryHandler = new StringStateTableHandler(new SalaryRowStateHandler())

  private constructor() {
    super()
  }

  static getInstance(): EconomicStateHandler {
    if (!EconomicStateHandler._instance) {
      EconomicStateHandler._instance = new EconomicStateHandler()
    }
    return EconomicStateHandler._instance
  }

  fromDto(dto: MeasuresEffectivenessDto): MeasuresEffectivenessState {
    throw new Error('Method not implemented.')
  }

  toDto(state: MeasuresEffectivenessState): MeasuresEffectivenessDto {
    throw new Error('Method not implemented.')
  }

  validate(tgt: MeasuresEffectivenessState): Status {
    this.reset(tgt)
    this.checkEquipmentNames(tgt, tgt.additionalExpenditures.rows)
    this.checkEquipmentNames(tgt, tgt.salary.rows)
    return tgt.status
  }

  createDefault(): MeasuresEffectivenessState {
    const state = {
      handle: StateHandler.cnt++,
      status: Status.Ok,
      capacity: this.capacityHandler.create({}),
      parallelSchedule: this.parSchHandler.create({}),
      capitalExpenditures: this.capitalExpendituresHandler.createDefault(),
      additionalExpenditures: this.additionalExpendituresHandler.createDefault(),
      salary: this.salaryHandler.createDefault()
    }
    console.log(state)
    return state
  }

  updateCapacityParams(tgt: MeasuresEffectivenessState, kwargs: CapacityParamsKw) {
    this.capacityHandler.update(tgt.capacity, kwargs)
  }

  updateParallelScheduleParams(tgt: MeasuresEffectivenessState, kwargs: ParallelScheduleParamsKwArgs) {
    this.parSchHandler.update(tgt.parallelSchedule, kwargs)
  }

  updateCapitalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number, kwargs: CapitalExpendituresRowKwArgs) {
    this.capitalExpendituresHandler.updateRow(tgt.capitalExpenditures, idx, kwargs)
    if (kwargs.equipment !== undefined) {
      this.checkEquipmentNames(tgt, tgt.additionalExpenditures.rows)
      this.checkEquipmentNames(tgt, tgt.salary.rows)
    }
  }

  insertCapitalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.capitalExpendituresHandler.insertRow(tgt.capitalExpenditures, idx, {})
  }

  deleteCapitalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.capitalExpendituresHandler.deleteRow(tgt.capitalExpenditures, idx)
    this.checkEquipmentNames(tgt, tgt.additionalExpenditures.rows)
    this.checkEquipmentNames(tgt, tgt.salary.rows)
  }

  duplicateCapitalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.capitalExpendituresHandler.duplicateRow(tgt.capitalExpenditures, idx)
  }

  updateAdditionalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number, kwargs: AdditionalExpendituresRowKwArgs) {
    this.additionalExpendituresHandler.updateRow(tgt.additionalExpenditures, idx, kwargs)
  }

  insertAdditionalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    const row = this.additionalExpendituresHandler.insertRow(tgt.additionalExpenditures, idx, {})
    this.checkEquipmentNames(tgt, [row])
  }

  deleteAdditionalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.additionalExpendituresHandler.deleteRow(tgt.additionalExpenditures, idx)
  }

  duplicateAdditionalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    const row = this.additionalExpendituresHandler.duplicateRow(tgt.additionalExpenditures, idx)
    this.checkEquipmentNames(tgt, [row])
  }

  uniqueEquipmentNames(current: string, arr: CapitalExpendituresRowState[]): string[] {
    const names = arr.map(row => row.equipment.value)
    names.splice(0, 0, '')
    names.push(current)
    return Array.from(new Set(names))
  }

  insertSalaryRow(tgt: MeasuresEffectivenessState, idx: number) {
    const row = this.salaryHandler.insertRow(tgt.salary, idx, {})
    this.checkEquipmentNames(tgt, [row])
  }

  updateSalaryRow(tgt: MeasuresEffectivenessState, idx: number, kwargs: SalaryStateKw) {
    this.salaryHandler.updateRow(tgt.salary, idx, kwargs)
  }

  deleteSalaryRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.salaryHandler.deleteRow(tgt.salary, idx)
  }

  duplicateSalaryRow(tgt: MeasuresEffectivenessState, idx: number) {
    const row = this.salaryHandler.duplicateRow(tgt.salary, idx)
    this.checkEquipmentNames(tgt, [row])
  }


  private checkEquipmentNames(tgt: MeasuresEffectivenessState, dependentRows: { equipment: StringState }[]) {
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
