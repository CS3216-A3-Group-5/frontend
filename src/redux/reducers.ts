import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import user from './slices/userSlice';

const rootPersistConfig = {
  key: 'root',
  storage,
};

export const rootReducer = persistReducer(
  rootPersistConfig,
  combineReducers({
    user,
  })
);