import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CapacityParamsStateHandlerKwArgs } from './model/capacity-params';
import { EconomicStateHandler } from './model/economic';
import { ParallelScheduleParamsKwArgs } from './model/parallel-schedule-params';

const h = EconomicStateHandler.getInstance();

const economicSlice = createSlice({
  name: 'economic',
  initialState: h.createDefault(),
  reducers: {
    updateCapacityParams(state,action: PayloadAction<CapacityParamsStateHandlerKwArgs>) {
      h.updateCapacityParams(state, action.payload);
      return state;
    },

    updateParallelScheduleParams(state,action: PayloadAction<ParallelScheduleParamsKwArgs>) {
      h.updateParallelScheduleParams(state, action.payload);
      return state;
    },
  }
});

export default economicSlice;
