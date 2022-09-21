import { combineReducers } from '@reduxjs/toolkit';
import user from './slices/userSlice';
import userDetails from './slices/userDetailsSlice';
import home from './slices/homeSlice';
import objectDetails from './slices/objectDetailsSlice';
import connections from './slices/connectionsSlice';
import modules from './slices/modulesSlice';

export const rootReducer = combineReducers({
  user,
  userDetails,
  home,
  objectDetails,
  connections,
  modules,
});
