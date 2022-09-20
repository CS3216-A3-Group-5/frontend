import { combineReducers } from '@reduxjs/toolkit';
import user from './slices/userSlice';
import userDetails from './slices/userDetailsSlice';

export const rootReducer = combineReducers({
  user,
  userDetails,
});
