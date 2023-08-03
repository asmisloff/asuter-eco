import { useEffect } from 'react';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { EconomicStateHandler } from '../model/economic';
import { CapacityParamsView } from './CapacityParamsView';

export default function Root() {
  const state = useAppSelector((state) => state.economic);
  const dispatch = useAppDispatch();
  const h = EconomicStateHandler.getInstance();

  return (
    <div>
      <CapacityParamsView capacity={state.capacity} />
    </div>
  );
}
