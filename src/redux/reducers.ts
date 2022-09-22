/* eslint-disable */
import { combineReducers } from '@reduxjs/toolkit';
import user from './slices/userSlice';
import userDetails from './slices/userDetailsSlice';
import home from './slices/homeSlice';
import objectDetails from './slices/objectDetailsSlice';
import connections from './slices/connectionsSlice';
import connectionList from './slices/connectionListSlice';
import modules from './slices/modulesSlice';

export const rootReducer = combineReducers({
  user,
  userDetails,
  home,
  objectDetails,
  connections,
  connectionList,
  modules,
});
