import { useAppSelector } from '../../store';
import { CapacityParamsView } from './CapacityParamsView';
import { ParallelScheduleParamsView } from './ParallelScheduleParamsView';
import React from 'react';

export default function Root() {
  const state = useAppSelector((state) => state.economic);
  return (
    <>
      <div>
        <CapacityParamsView capacity={state.capacity} />
      </div>
      <div>
        <ParallelScheduleParamsView sch={state.parallelSchedule} />
      </div>
    </>
  );
}
