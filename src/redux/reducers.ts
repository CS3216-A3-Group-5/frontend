/* eslint-disable */
import { combineReducers, PayloadAction } from '@reduxjs/toolkit';
import user from './slices/userSlice';
import userDetails from './slices/userDetailsSlice';
import home from './slices/homeSlice';
import objectDetails from './slices/objectDetailsSlice';
import connections from './slices/connectionsSlice';
import connectionList from './slices/connectionListSlice';
import modules from './slices/modulesSlice';
import { RootState } from './store';

const appReducer = combineReducers({
  user,
  userDetails,
  home,
  objectDetails,
  connections,
  connectionList,
  modules,
});

export const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
