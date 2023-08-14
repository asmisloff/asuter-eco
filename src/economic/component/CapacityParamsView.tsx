import { CSSProperties } from 'react'
import React from 'react'
import { StringState, localized } from '../../common/StringStateHandler'
import { Status } from '../../common/verifiable'
import { useAppDispatch } from '../../store'
import { CapacityParamsState } from '../model/capacity-params'
import { EconomicStateHandler } from '../handler/ActionsEffectivenessStateHandler'
import economicSlice from '../slice'
import './style.css'

export function getStyle(status: Status): CSSProperties {
  let color = ''
  if (status === Status.Error) {
    color = 'pink'
  } else if (status === Status.Warning) {
    color = 'lightyellow'
  }
  return {
    backgroundColor: color
  }
}

export const StringStateInput = (props: {
  state: StringState
  label?: string
  placeholder?: string
  onBlur: (v: string) => void
}) => {
  return (
    <div>
      <input
        key={props.state.handle}
        name="mass"
        type="text"
        defaultValue={props.state.value}
        style={getStyle(props.state.status)}
        className={'warning'}
        title={props.state.what?.map(s => localized(s))?.join('\n') ?? ''}
        placeholder={props.placeholder ?? ''}
        onBlur={(e) => props.onBlur(e.target.value)}
      />
      {props.label && <label htmlFor="mass"> - {props.label}</label>}
    </div>
  )
}

export function CapacityParamsView(props: { capacity: CapacityParamsState }) {
  const {
    oldCapacityInfo,
    newCapacityInfo,
    maxTrainMass,
    oldInterval,
    newInterval,
    oldTrainQty,
    newTrainQty
  } = props.capacity
  const dispatch = useAppDispatch()
  const h = EconomicStateHandler.getInstance()
  const intervalDiff = h.intervalDiff(props.capacity)
  const trainQtyDiff = h.trainQtyDiff(props.capacity)
  return (
    <div>
      <h2>Пропускная</h2>
      <textarea
        defaultValue={JSON.stringify(oldCapacityInfo)}
        onBlur={(e) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({
              oldCapacityInfo: JSON.parse(e.target.value)
            })
          )
        }
        style={{ width: 300, height: 120 }}
      />
      <textarea
        defaultValue={JSON.stringify(newCapacityInfo)}
        onBlur={(e) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({
              newCapacityInfo: JSON.parse(e.target.value)
            })
          )
        }
        style={{ width: 300, height: 120 }}
      />
      <StringStateInput
        state={maxTrainMass}
        label={'Масса'}
        placeholder={
          h.capacityHandler.defaultMass(props.capacity)?.toString() ?? ''
        }
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({ maxTrainMass: v })
          )
        }
      />
      <StringStateInput
        state={oldInterval}
        label={'Старый интервал'}
        placeholder={props.capacity.oldCapacityInfo?.interval?.toString() ?? ''}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({ oldInterval: v })
          )
        }
      />
      <StringStateInput
        state={newInterval}
        label={'Новый интервал'}
        placeholder={props.capacity.newCapacityInfo?.interval?.toString() ?? ''}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({ newInterval: v })
          )
        }
      />
      <StringStateInput
        state={oldTrainQty}
        label={'Старое количество'}
        placeholder={props.capacity.oldCapacityInfo?.trainQty?.toString() ?? ''}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({ oldTrainQty: v })
          )
        }
      />
      <StringStateInput
        state={newTrainQty}
        label={'Новое количество'}
        placeholder={props.capacity.newCapacityInfo?.trainQty?.toString() ?? ''}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({ newTrainQty: v })
          )
        }
      />

      <div>
        <input type="text" name="absPowerDiff" disabled value={intervalDiff.abs} />
        <input type="text" name="relPowerDiff" disabled value={intervalDiff.rel} />
        <label htmlFor="relPowerDiff">Изменение в межпоездном интервале</label>
      </div>
      <div>
        <input type="text" name="absPowerDiff" disabled value={trainQtyDiff.abs} />
        <input type="text" name="relPowerDiff" disabled value={trainQtyDiff.rel} />
        <label htmlFor="relPowerDiff">Изменение в межпоездном интервале</label>
      </div>

    </div>
  )
}
