import { CSSProperties, useEffect, useState } from 'react'
import React from 'react'
import { StringState, localized } from '../../common/StringStateHandler'
import { Status } from '../../common/verifiable'
import { useAppDispatch } from '../../store'
import { CapacityParamsState } from '../model/capacity-params'
import { EfficiencyComputationMainHandler } from '../handler/EfficiencyComputationMainHandler'
import economicSlice from '../slice'

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

export function TextArea<T>(props: {
  obj: T | null,
  onBlur: (v: T | null) => void,
  disabled?: boolean,
  titleIfDisabled?: string,
  required?: boolean
}) {
  const [text, setText] = useState('null')
  useEffect(() => {
    let text: string
    try {
      text = JSON.stringify(props.obj)
    } catch (e: any) {
      text = 'null'
    }
    setText(text)
  }, [props.obj])
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
      onBlur={e => {
        let obj: T | null
        try {
          obj = JSON.parse(e.target.value) as T
        } catch (e: any) {
          obj = null
        }
        props.onBlur(obj)
      }}
      style={{ width: 300, height: 120, backgroundColor: props.required && props.obj === null ? 'pink' : '' }}
      disabled={props.disabled}
      title={props.disabled ? props.titleIfDisabled : ''}
    />
  )
}

export function CapacityParamsView(props: { capacity: CapacityParamsState, isTrackSelected: boolean }) {
  const {
    oldCapacityDto: oldCapacityInfo,
    newCapacityDto: newCapacityInfo,
    maxTrainMass,
    oldInterval,
    newInterval,
    oldTrainQty,
    newTrainQty
  } = props.capacity
  const dispatch = useAppDispatch()
  const h = EfficiencyComputationMainHandler.getInstance()
  const intervalDiff = h.intervalDiff(props.capacity)
  const trainQtyDiff = h.trainQtyDiff(props.capacity)
  return (
    <div>
      <h2>Пропускная</h2>
      <TextArea
        obj={oldCapacityInfo}
        onBlur={obj => dispatch(economicSlice.actions.updateCapacityParams({ oldCapacityDto: obj }))}
        disabled={!props.isTrackSelected}
        titleIfDisabled='Сначала нужно выбрать участок'
      />
      <TextArea
        obj={newCapacityInfo}
        onBlur={obj => dispatch(economicSlice.actions.updateCapacityParams({ newCapacityDto: obj }))}
        disabled={!props.isTrackSelected}
        titleIfDisabled='Сначала нужно выбрать участок'
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
        placeholder={props.capacity.oldCapacityDto?.trainInterval?.toString() ?? ''}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({ oldInterval: v })
          )
        }
      />
      <StringStateInput
        state={newInterval}
        label={'Новый интервал'}
        placeholder={props.capacity.newCapacityDto?.trainInterval?.toString() ?? ''}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({ newInterval: v })
          )
        }
      />
      <StringStateInput
        state={oldTrainQty}
        label={'Старое количество'}
        placeholder={props.capacity.oldCapacityDto?.trainQty?.toString() ?? ''}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.updateCapacityParams({ oldTrainQty: v })
          )
        }
      />
      <StringStateInput
        state={newTrainQty}
        label={'Новое количество'}
        placeholder={props.capacity.newCapacityDto?.trainQty?.toString() ?? ''}
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
        <label htmlFor="relPowerDiff">Изменение в количестве поездов</label>
      </div>

    </div>
  )
}
