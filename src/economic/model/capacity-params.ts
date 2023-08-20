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
  schemaId: number
  name: string
  maxTrainMass: number
  interval: number
  trainQty: number
}

export interface CapacityParamsKw {
  oldCapacityInfo?: CapacityInfo | null
  newCapacityInfo?: CapacityInfo | null
  maxTrainMass?: string
  oldInterval?: string
  newInterval?: string
  oldTrainQty?: string
  newTrainQty?: string
}
