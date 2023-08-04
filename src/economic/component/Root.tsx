import { useAppSelector } from '../../store';
import { CapacityParamsView } from './CapacityParamsView';
import { CapitalExpendituresTableView } from './CapitalExpendituresTableView';
import { ParallelScheduleParamsView } from './ParallelScheduleParamsView';
import React from 'react';
import { AdditionalExpendituresTableView } from './AdditionalExpendituresTableView';

export default function Root() {
  const state = useAppSelector((state) => state.economic);
  return (
    <>
      <CapacityParamsView capacity={state.capacity} />
      <ParallelScheduleParamsView sch={state.parallelSchedule} />
      <CapitalExpendituresTableView tbl={state.capitalExpenditures} />
      <AdditionalExpendituresTableView tbl={state.additionalExpenditures} capitalTbl={state.capitalExpenditures}/>
    </>
  );
}
