import { CapacityParamsStateHandler } from 'economic/handler/CapacityParamsStateHandler'
import { StateHandler, Status, Verifiable } from '../../common/verifiable'
import { CapacityParamsDto, CapacityParamsState, CapacityParamsStateHandlerKwArgs } from './capacity-params'
import { ParallelScheduleParamsKwArgs, ParallelScheduleParamsState } from './parallel-schedule-params'
import { ParallelScheduleParamsStateHandler } from 'economic/handler/ParallelScheduleParamsStateHandler'

interface EconomicDto {
  capacity: CapacityParamsDto
}

interface EconomicState extends Verifiable {
  capacity: CapacityParamsState,
  parallelSchedule: ParallelScheduleParamsState
}

export class EconomicStateHandler extends StateHandler<EconomicState, EconomicDto> {

  readonly capacityHandler = new CapacityParamsStateHandler()
  readonly parSchHandler = new ParallelScheduleParamsStateHandler()

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

  fromDto(dto: EconomicDto): EconomicState {
    throw new Error('Method not implemented.')
  }

  toDto(state: EconomicState): EconomicDto {
    throw new Error('Method not implemented.')
  }

  validate(tgt: EconomicState): Status {
    throw new Error('Method not implemented.')
  }

  createDefault(): EconomicState {
    return {
      handle: this.cnt++,
      status: Status.Ok,
      capacity: this.capacityHandler.create({}),
      parallelSchedule: this.parSchHandler.create({})
    }
  }

  updateCapacityParams(tgt: EconomicState, kwargs: CapacityParamsStateHandlerKwArgs) {
    this.capacityHandler.update(tgt.capacity, kwargs)
  }

  updateParallelScheduleParams(tgt: EconomicState, kwargs: ParallelScheduleParamsKwArgs) {
    this.parSchHandler.update(tgt.parallelSchedule, kwargs)
  }
}
