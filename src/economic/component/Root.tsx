import { useAppDispatch, useAppSelector } from '../../store'
import { CapacityParamsView, StringStateInput } from './CapacityParamsView'
import { CapitalExpendituresView } from './CapitalExpendituresView'
import { ParallelScheduleParamsView } from './ParallelScheduleParamsView'
import React, { memo } from 'react'
import { AdditionalExpendituresView } from './AdditionalExpendituresView'
import { SalaryView } from './SalaryView'
import { RatesView } from './Rates'
import { EfficiencyComputationMainHandler } from 'economic/handler/EfficiencyComputationMainHandler'
import { Status } from 'common/verifiable'
import { useDispatch } from 'react-redux'
import economicSlice from 'economic/slice'

export default function Root() {
  const state = useAppSelector((state) => state.economic)
  const dispatch = useAppDispatch()
  const h = EfficiencyComputationMainHandler.getInstance()
  return (
    <>
      <div>
        <StringStateInput
          state={state.name}
          onBlur={v => dispatch(economicSlice.actions.updateName(v))}
          label='Наименование расчёта'
        />
        <StringStateInput
          state={state.description}
          onBlur={v => dispatch(economicSlice.actions.updateDescription(v))}
          label='Примечание'
        />
      </div>
      <div>
        <h2>Участок</h2>
        <textarea
          defaultValue={JSON.stringify(state.track)}
          onBlur={e => dispatch(economicSlice.actions.updateTrack(JSON.parse(e.target.value)))}
        />
      </div>
      <MCapacityParamsView capacity={state.capacity} isTrackSelected={state.track !== null} />
      <MParallelScheduleParamsView
        sch={state.parallelSchedule}
        isOldCapacitySelected={state.capacity.oldCapacityDto !== null}
        isNewCapacitySelected={state.capacity.newCapacityDto !== null}
      />
      <MCapitalExpendituresView tbl={state.capitalExpenditures} />
      <MAdditionalExpendituresView tbl={state.additionalExpenditures} capitalTbl={state.capitalExpenditures} />
      <MSalaryView tbl={state.salary} capitalTbl={state.capitalExpenditures} />
      <MRatesView rates={state.rates} />
      <button
        onClick={() => console.log(h.toDto(state))}
        disabled={state.status > Status.Warning}
        title={h.logErrors(state)}
      >toDto</button>
    </>
  )
}

const MCapacityParamsView = memo(CapacityParamsView)
const MParallelScheduleParamsView = memo(ParallelScheduleParamsView)
const MCapitalExpendituresView = memo(CapitalExpendituresView)
const MAdditionalExpendituresView = memo(AdditionalExpendituresView)
const MSalaryView = memo(SalaryView)
const MRatesView = memo(RatesView)