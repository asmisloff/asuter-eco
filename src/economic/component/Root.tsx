import { useAppSelector } from '../../store'
import { CapacityParamsView } from './CapacityParamsView'
import { CapitalExpendituresTableView } from './CapitalExpendituresTableView'
import { ParallelScheduleParamsView } from './ParallelScheduleParamsView'
import React, { memo } from 'react'
import { AdditionalExpendituresTableView } from './AdditionalExpendituresTableView'
import { SalaryView } from './SalaryView'
import { RatesView } from './Rates'

export default function Root() {
  const state = useAppSelector((state) => state.economic)
  return (
    <>
      <MCapacityParamsView capacity={state.capacity} />
      <MParallelScheduleParamsView sch={state.parallelSchedule} />
      <MCapitalExpendituresTableView tbl={state.capitalExpenditures} />
      <MAdditionalExpendituresTableView tbl={state.additionalExpenditures} capitalTbl={state.capitalExpenditures} />
      <MSalaryView tbl={state.salary} capitalTbl={state.capitalExpenditures} />
      <MRatesView rates={state.rates} />
      <textarea value={state.what?.join('\n')} />
    </>
  )
}

const MCapacityParamsView = memo(CapacityParamsView)
const MParallelScheduleParamsView = memo(ParallelScheduleParamsView)
const MCapitalExpendituresTableView = memo(CapitalExpendituresTableView)
const MAdditionalExpendituresTableView = memo(AdditionalExpendituresTableView)
const MSalaryView = memo(SalaryView)
const MRatesView = memo(RatesView)