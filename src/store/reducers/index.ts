import { combineReducers } from "@reduxjs/toolkit";
import economicSlice from "../../economic/slice";
import trainsSlice from "../../train-list/slice";

const reducers = combineReducers({
  trains: trainsSlice.reducer,
  economic: economicSlice.reducer
});

export default reducers;
