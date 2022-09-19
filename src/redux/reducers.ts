import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import user from './slices/userSlice';
import userDetails from './slices/userDetailsSlice'

const rootPersistConfig = {
  key: 'root',
  storage,
};

export const rootReducer = persistReducer(
  rootPersistConfig,
  combineReducers({
    user,
    userDetails
  })
);
