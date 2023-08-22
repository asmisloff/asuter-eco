import { ParallelScheduleParamsState } from 'economic/model/parallel-schedule-params'
import { StringStateInput, TextArea } from './CapacityParamsView'
import React from 'react'
import { useAppDispatch } from 'store'
import economicSlice from 'economic/slice'
import { EfficiencyComputationMainHandler } from 'economic/handler/EfficiencyComputationMainHandler'

export function ParallelScheduleParamsView(
    props: { sch: ParallelScheduleParamsState, isOldCapacitySelected: boolean, isNewCapacitySelected: boolean }
) {
    const dispatch = useAppDispatch()
    const h = EfficiencyComputationMainHandler.getInstance()
    const powerDiff = h.powerDiff(props.sch)
    return (
        <div>
            <h2>Нагрузочная</h2>
            <TextArea
                obj={props.sch.oldComputation}
                onBlur={v =>
                    dispatch(
                        economicSlice.actions.updateParallelScheduleParams({oldComputation: v})
                    )
                }
                disabled={!props.isOldCapacitySelected}
                titleIfDisabled={'Сначала нужно выбрать базовый расчет пропускной способности'}
            />
            <TextArea
                obj={props.sch.newComputation}
                onBlur={v =>
                    dispatch(
                        economicSlice.actions.updateParallelScheduleParams({newComputation: v})
                    )
                }
                disabled={!props.isNewCapacitySelected}
                titleIfDisabled={'Сначала нужно выбрать базовый расчет пропускной способности'}
            />
            <StringStateInput
                state={props.sch.oldDailyConsumption}
                label={'Старое суточное потербление'}
                placeholder={props.sch.oldComputation?.energyConsumption?.toString() ?? ''}
                onBlur={v => dispatch(economicSlice.actions.updateParallelScheduleParams({ oldDailyConsumption: v }))}
            />
            <StringStateInput
                state={props.sch.newDailyConsumption}
                label={'Новое суточное потербление'}
                placeholder={props.sch.newComputation?.energyConsumption?.toString() ?? ''}
                onBlur={v => dispatch(economicSlice.actions.updateParallelScheduleParams({ newDailyConsumption: v }))}
            />
            <div>
                <input type="text" name="absPowerDiff" disabled value={powerDiff.abs} />
                <input type="text" name="relPowerDiff" disabled value={powerDiff.rel} />
                <label htmlFor="relPowerDiff">Изменение в расходе электроэнергии</label>
            </div>
        </div>
    )
}
