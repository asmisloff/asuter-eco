import { Verifiable } from '../../common/verifiable'
import { StringState } from '../../common/StringStateHandler'

export interface CapacityParamsState extends Verifiable {
  oldCapacityInfo: CapacityInfo | null
  newCapacityInfo: CapacityInfo | null
  maxTrainMass: StringState
  oldInterval: StringState
  newInterval: StringState
  oldTrainQty: StringState
  newTrainQty: StringState
}

interface CapacityInfo {
  id: number
  name: string
  maxTrainMass: number
  interval: number
  trainQty: number
}

export interface CapacityParamsDto {
  oldCapacityId?: CapacityInfo
  newCapacityId?: CapacityInfo
  maxTrainMass?: number
  oldInterval?: number
  newInterval?: number
  oldTrainQty?: number
  newTrainQty?: number
}

export interface CapacityParamsStateHandlerKwArgs {
  oldCapacityInfo?: CapacityInfo
  newCapacityInfo?: CapacityInfo
  maxTrainMass?: string | number
  oldInterval?: string | number
  newInterval?: string | number
  oldTrainQty?: string | number
  newTrainQty?: string | number
}
