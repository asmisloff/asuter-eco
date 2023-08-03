import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrainDto } from "./dto";
import { TrainList } from "./model";
import { TrainListStateHandler } from "./handler/TrainListStateHandler";

const h = TrainListStateHandler.instance;

const trainsSlice = createSlice({
  name: "counter",
  initialState: h.createInstance(),
  reducers: {
    setTrains(_state, action: PayloadAction<TrainDto[]>) {
      return h.fromDto(action.payload);
    },

    setSelectedTrainIdx: (state: TrainList, action: PayloadAction<number>) => {
      state.selectedTrainIdx = action.payload;
    },

    updateCharacteristic(
      state: TrainList,
      action: PayloadAction<{
        trainIdx: number;
        charIdx: number;
        args: { speed?: string; force?: string; amp?: string };
      }>
    ) {
      return h.updateCharacteristic(
        state,
        action.payload.charIdx,
        action.payload.args
      );
    },

    insertCharacteristic(
      state: TrainList,
      action: PayloadAction<{ pos: number }>
    ) {
      return h.insertCharacteristicIntoSelectedTrain(state, action.payload.pos);
    },

    removeCharacteristic(
      state: TrainList,
      action: PayloadAction<{ pos: number }>
    ) {
      return h.removeCharacteristicFromSelectedTrain(state, action.payload.pos);
    },

    insertTrain(state, action: PayloadAction<number>) {
      return h.insertTrain(state, action.payload);
    },

    removeTrain(state, action: PayloadAction<number>) {
      return h.removeTrain(state, action.payload);
    }
  }
});

export default trainsSlice;
