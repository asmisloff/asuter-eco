import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CapacityParamsStateHandlerKwArgs } from './model/capacity-params';
import { EconomicStateHandler } from './handler/ActionsEffectivenessStateHandler';
import { ParallelScheduleParamsKwArgs } from './model/parallel-schedule-params';
import { CapitalExpendituresRowKwArgs } from './model/capital-expenditures';

const h = EconomicStateHandler.getInstance();

const economicSlice = createSlice({
  name: 'economic',
  initialState: h.createDefault(),
  reducers: {
    updateCapacityParams(state, action: PayloadAction<CapacityParamsStateHandlerKwArgs>) {
      h.updateCapacityParams(state, action.payload);
    },

    updateParallelScheduleParams(state, action: PayloadAction<ParallelScheduleParamsKwArgs>) {
      h.updateParallelScheduleParams(state, action.payload);
    },

    updateCapitalExpendituresRow(state, action: PayloadAction<{ idx: number } & CapitalExpendituresRowKwArgs>) {
      h.updateCapitalExpendituresRow(state, action.payload.idx, action.payload)
    },

    insertCapitalExpendituresRow(state, action: PayloadAction<number>) {
      h.insertCapitalExpendituresRow(state, action.payload)
      return state
    },

    deleteCapitalExpendituresRow(state, action: PayloadAction<number>) {
      h.deleteCapitalExpendituresRow(state, action.payload)
    },

    duplicateCapitalExpendituresRow(state, action: PayloadAction<number>) {
      h.duplicateCapitalExpendituresRow(state, action.payload)
    },

    updateAdditionalExpendituresRow(state, action: PayloadAction<{ idx: number } & CapitalExpendituresRowKwArgs>) {
      h.updateAdditionalExpendituresRow(state, action.payload.idx, action.payload)
    },

    insertAdditionalExpendituresRow(state, action: PayloadAction<number>) {
      h.insertAdditionalExpendituresRow(state, action.payload)
    }
  }
});

export default economicSlice;
