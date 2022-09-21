import { combineReducers } from '@reduxjs/toolkit';
import user from './slices/userSlice';
import userDetails from './slices/userDetailsSlice';
import home from './slices/homeSlice';
import objectDetails from './slices/objectDetailsSlice';
import modules from './slices/modulesSlice';

export const rootReducer = combineReducers({
  user,
  userDetails,
  home,
  objectDetails,
  modules,
});
