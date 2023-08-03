import { combineReducers } from '@reduxjs/toolkit';
import economicSlice from '../../economic/slice';

const reducers = combineReducers({
  economic: economicSlice.reducer
});

export default reducers;
