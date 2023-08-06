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

export interface CapacityInfo {
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

export interface CapacityParamsKw {
  oldCapacityInfo?: CapacityInfo
  newCapacityInfo?: CapacityInfo
  maxTrainMass?: string
  oldInterval?: string
  newInterval?: string
  oldTrainQty?: string
  newTrainQty?: string
}
