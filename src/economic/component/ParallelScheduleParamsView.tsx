import { ParallelScheduleParamsState } from 'economic/model/parallel-schedule-params'
import { StringStateInput } from './CapacityParamsView'
import React from 'react'
import { useAppDispatch } from 'store'
import economicSlice from 'economic/slice'
import { EfficiencyComputationStateHandler } from 'economic/handler/ActionsEffectivenessStateHandler'

export function ParallelScheduleParamsView(props: { sch: ParallelScheduleParamsState }) {
    const dispatch = useAppDispatch()
    const h = EfficiencyComputationStateHandler.getInstance()
    const powerDiff = h.powerDiff(props.sch)
    return (
        <div>
            <h2>Нагрузочная</h2>
            <textarea
                defaultValue={JSON.stringify(props.sch.oldComputation)}
                onBlur={(e) =>
                    dispatch(
                        economicSlice.actions.updateParallelScheduleParams({
                            oldComputation: JSON.parse(e.target.value)
                        })
                    )
                }
                style={{ width: 300, height: 120 }}
            />
            <textarea
                defaultValue={JSON.stringify(props.sch.newComputation)}
                onBlur={(e) =>
                    dispatch(
                        economicSlice.actions.updateParallelScheduleParams({
                            newComputation: JSON.parse(e.target.value)
                        })
                    )
                }
                style={{ width: 300, height: 120 }}
            />
            <StringStateInput
                state={props.sch.oldDailyConsumption}
                label={'Старое суточное потербление'}
                placeholder={props.sch.oldComputation?.consumption?.toString() ?? ''}
                onBlur={v => dispatch(economicSlice.actions.updateParallelScheduleParams({ oldDailyConsumption: v }))}
            />
            <StringStateInput
                state={props.sch.newDailyConsumption}
                label={'Новое суточное потербление'}
                placeholder={props.sch.newComputation?.consumption?.toString() ?? ''}
                onBlur={v => dispatch(economicSlice.actions.updateParallelScheduleParams({ newDailyConsumption: v }))}
            />
            <div>
                <input type="text" name="absPowerDiff" disabled value={powerDiff.abs}/>
                <input type="text" name="relPowerDiff" disabled value={powerDiff.rel}/>
                <label htmlFor="relPowerDiff">Изменение в расходе электроэнергии</label>
            </div>
        </div>
    )
}
