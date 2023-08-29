import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CapacityParamsKwargs } from './model/capacity-params';
import { EfficiencyComputationMainHandler } from './handler/EfficiencyComputationMainHandler';
import { ParallelScheduleParamsKwargs } from './model/parallel-schedule-params';
import { CapitalExpendituresRowKwargs } from './model/capital-expenditures';
import { AdditionalExpendituresRowKwargs } from './model/additional-expendures';
import { SalaryStateKwargs } from './model/salary'
import { RatesStateKwargs } from './model/rates'
import { TrackParams } from './model/efficiency-computation';
import { EfficiencyComputationDto } from './model/dto';

const h = EfficiencyComputationMainHandler.getInstance();

const economicSlice = createSlice({
    name: 'economic',
    initialState: h.createDefault(),
    reducers: {
        updateName(state, action: PayloadAction<string>) {
            h.updateName(state, action.payload)
        },

        updateDescription(state, action: PayloadAction<string>) {
            h.updateDescription(state, action.payload)
        },

        updateTrack(state, action: PayloadAction<TrackParams | null>) {
            h.updateTrack(state, action.payload)
        },

        updateCapacityParams(state, action: PayloadAction<CapacityParamsKwargs>) {
            h.updateCapacityParams(state, action.payload);
        },

        updateParallelScheduleParams(state, action: PayloadAction<ParallelScheduleParamsKwargs>) {
            h.updateParallelScheduleParams(state, action.payload);
        },

        updateCapitalExpendituresRow(state, action: PayloadAction<{ idx: number } & CapitalExpendituresRowKwargs>) {
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

        updateAdditionalExpendituresRow(state, action: PayloadAction<{ idx: number } & AdditionalExpendituresRowKwargs>) {
            h.updateAdditionalExpendituresRow(state, action.payload.idx, action.payload)
        },

        insertAdditionalExpendituresRow(state, action: PayloadAction<number>) {
            h.insertAdditionalExpendituresRow(state, action.payload)
        },

        deleteAdditionalExpendituresRow(state, action: PayloadAction<number>) {
            h.deleteAdditionalExpendituresRow(state, action.payload)
        },

        duplicateAdditionalExpendituresRow(state, action: PayloadAction<number>) {
            h.duplicateAdditionalExpendituresRow(state, action.payload)
        },

        insertSalaryRow(state, action: PayloadAction<number>) {
            h.insertSalaryRow(state, action.payload)
        },

        updateSalaryRow(state, action: PayloadAction<{ idx: number } & SalaryStateKwargs>) {
            h.updateSalaryRow(state, action.payload.idx, action.payload)
        },

        deleteSalaryRow(state, action: PayloadAction<number>) {
            h.deleteSalaryRow(state, action.payload)
        },

        duplicateSalaryRow(state, action: PayloadAction<number>) {
            h.duplicateSalaryRow(state, action.payload)
        },

        updateRates(state, action: PayloadAction<RatesStateKwargs>) {
            h.updateRates(state, action.payload)
        },

        fromDto(state, action: PayloadAction<EfficiencyComputationDto>) {
            return h.fromDto(action.payload)
        }
    }
});

export default economicSlice;
