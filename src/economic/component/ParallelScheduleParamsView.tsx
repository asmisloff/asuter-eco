import { ParallelScheduleParamsState } from 'economic/model/parallel-schedule-params';
import { StringStateInput } from './CapacityParamsView';
import React from 'react';
import { useAppDispatch } from 'store';
import economicSlice from 'economic/slice';
import { EconomicStateHandler } from 'economic/model/economic';

export const ParallelScheduleParamsView = (props: { sch: ParallelScheduleParamsState }) => {
    const dispatch = useAppDispatch()
    const h = EconomicStateHandler.getInstance()
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
                placeholder={h.parSchHandler.defaultDailyConsumption(props.sch.oldComputation)}
                onBlur={v => dispatch(economicSlice.actions.updateParallelScheduleParams({ oldDailyConsumption: v }))}
            />
            <StringStateInput
                state={props.sch.newDailyConsumption}
                label={'Новое суточное потербление'}
                placeholder={h.parSchHandler.defaultDailyConsumption(props.sch.newComputation)}
                onBlur={v => dispatch(economicSlice.actions.updateParallelScheduleParams({ newDailyConsumption: v }))}
            />
        </div>
    )
}
