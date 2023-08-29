import { Verifiable } from '../../common/verifiable'
import { StringState } from '../../common/StringStateHandler'
import { CapacityEconComputationDto } from './dto'

export interface CapacityParamsState extends Verifiable {
  oldCapacityDto: CapacityEconComputationDto | null
  newCapacityDto: CapacityEconComputationDto | null
  maxTrainMass: StringState
  oldInterval: StringState
  newInterval: StringState
  oldTrainQty: StringState
  newTrainQty: StringState
}

export interface CapacityParamsKwargs {
  oldCapacityDto?: CapacityEconComputationDto | null
  newCapacityDto?: CapacityEconComputationDto | null
  maxTrainMass?: string
  oldInterval?: string
  newInterval?: string
  oldTrainQty?: string
  newTrainQty?: string
}
