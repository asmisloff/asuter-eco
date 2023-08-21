import { useAppSelector } from '../../store'
import { CapacityParamsView } from './CapacityParamsView'
import { CapitalExpendituresTableView } from './CapitalExpendituresTableView'
import { ParallelScheduleParamsView } from './ParallelScheduleParamsView'
import React, { memo } from 'react'
import { AdditionalExpendituresTableView } from './AdditionalExpendituresTableView'
import { SalaryView } from './SalaryView'
import { RatesView } from './Rates'
import { EfficiencyComputationMainHandler } from 'economic/handler/EfficiencyComputationMainHandler'
import { Status } from 'common/verifiable'

export default function Root() {
  const state = useAppSelector((state) => state.economic)
  const h = EfficiencyComputationMainHandler.getInstance()
  return (
    <>
      <MCapacityParamsView capacity={state.capacity} isTrackSelected={state.track !== null} />
      <MParallelScheduleParamsView 
        sch={state.parallelSchedule}
        isOldCapacitySelected={state.capacity.oldCapacityDto !== null}
        isNewCapacitySelected={state.capacity.newCapacityDto !== null}
      />
      <MCapitalExpendituresTableView tbl={state.capitalExpenditures} />
      <MAdditionalExpendituresTableView tbl={state.additionalExpenditures} capitalTbl={state.capitalExpenditures} />
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
const MCapitalExpendituresTableView = memo(CapitalExpendituresTableView)
const MAdditionalExpendituresTableView = memo(AdditionalExpendituresTableView)
const MSalaryView = memo(SalaryView)
const MRatesView = memo(RatesView)