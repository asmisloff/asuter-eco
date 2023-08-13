import { useAppDispatch, useAppSelector } from '../../store'
import { CapacityParamsView } from './CapacityParamsView'
import { CapitalExpendituresTableView } from './CapitalExpendituresTableView'
import { ParallelScheduleParamsView } from './ParallelScheduleParamsView'
import React from 'react'
import { AdditionalExpendituresTableView } from './AdditionalExpendituresTableView'
import { SalaryView } from './SalaryView'
import { RatesHandler } from 'economic/handler/RatesHandler'
import { RatesView } from './Rates'

export default function Root() {
  const state = useAppSelector((state) => state.economic)
  return (
    <>
      <CapacityParamsView capacity={state.capacity} />
      <ParallelScheduleParamsView sch={state.parallelSchedule} />
      <CapitalExpendituresTableView tbl={state.capitalExpenditures} />
      <AdditionalExpendituresTableView tbl={state.additionalExpenditures} capitalTbl={state.capitalExpenditures} />
      <SalaryView tbl={state.salary} capitalTbl={state.capitalExpenditures} />
      <RatesView rates={state.rates} />
    </>
  )
}
