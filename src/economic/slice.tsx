import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CapacityParamsStateHandlerKwArgs } from './model/capacity-params';
import { EconomicStateHandler } from './model/economic';

const h = EconomicStateHandler.getInstance();

const economicSlice = createSlice({
  name: 'economic',
  initialState: h.createDefault(),
  reducers: {
    update_capacityParams(state,action: PayloadAction<CapacityParamsStateHandlerKwArgs>) {
      h.updateCapacityParams(state, action.payload);
      return state;
    },

    
  }
});

export default economicSlice;
