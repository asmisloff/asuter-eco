import { CapacityParamsStateHandler } from 'economic/handler/CapacityParamsStateHandler'
import { StateHandler, Status, Verifiable } from '../../common/verifiable'
import { CapacityParamsDto, CapacityParamsState, CapacityParamsStateHandlerKwArgs } from '../model/capacity-params'
import { ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from '../model/parallel-schedule-params'
import { ParallelScheduleParamsStateHandler } from 'economic/handler/ParallelScheduleParamsStateHandler'
import { CapitalExpendituresRowKwArgs, CapitalExpendituresTableState } from '../model/capital-expenditures'
import { CapitalExpendituresStateHandler } from 'economic/handler/CapitalExpendituresStateHandler'
import { MeasuresEffectivenessDto, MeasuresEffectivenessState } from 'economic/model/measure-effectiveness'
import { AdditionalExpendituresStateHandler } from './AdditionalExpenduresStateHandler'
import { AdditionalExpendituresRowKwArgs } from 'economic/model/additional-expendures'

export class EconomicStateHandler extends StateHandler<MeasuresEffectivenessState, MeasuresEffectivenessDto> {

  readonly capacityHandler = new CapacityParamsStateHandler()
  readonly parSchHandler = new ParallelScheduleParamsStateHandler()
  readonly capitalExpendituresHandler = new CapitalExpendituresStateHandler()
  readonly additionalExpendituresHandler = new AdditionalExpendituresStateHandler()

  private constructor() {
    super()
  }

  private static _instance?: EconomicStateHandler = undefined
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
    throw new Error('Method not implemented.')
  }

  createDefault(): MeasuresEffectivenessState {
    return {
      handle: this.cnt++,
      status: Status.Ok,
      capacity: this.capacityHandler.create({}),
      parallelSchedule: this.parSchHandler.create({}),
      capitalExpenditures: this.capitalExpendituresHandler.createDefault(),
      additionalExpenditures: this.additionalExpendituresHandler.createDefault()
    }
  }

  updateCapacityParams(tgt: MeasuresEffectivenessState, kwargs: CapacityParamsStateHandlerKwArgs) {
    this.capacityHandler.update(tgt.capacity, kwargs)
  }

  updateParallelScheduleParams(tgt: MeasuresEffectivenessState, kwargs: ParallelScheduleParamsKwArgs) {
    this.parSchHandler.update(tgt.parallelSchedule, kwargs)
  }

  updateCapitalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number, kwargs: CapitalExpendituresRowKwArgs) {
    this.capitalExpendituresHandler.updateRow(tgt.capitalExpenditures, idx, kwargs)
  }

  insertCapitalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.capitalExpendituresHandler.insertRow(tgt.capitalExpenditures, idx, {})
  }

  deleteCapitalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.capitalExpendituresHandler.deleteRow(tgt.capitalExpenditures, idx)
  }

  duplicateCapitalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.capitalExpendituresHandler.duplicateRow(tgt.capitalExpenditures, idx)
  }

  updateAdditionalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number, kwargs: AdditionalExpendituresRowKwArgs) {
    this.additionalExpendituresHandler.updateRow(tgt.additionalExpenditures, idx, kwargs)
  }

  insertAdditionalExpendituresRow(tgt: MeasuresEffectivenessState, idx: number) {
    this.additionalExpendituresHandler.insertRow(tgt.additionalExpenditures, idx, {})
  }
}
