/**
 * Redux libary that stores all the detailed versions of objects that have been queried.
 * There is a limit to how many of each type of object can be stored, the implementation is done using an LRU.
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getStudentsOfModule } from '../../api/modules';
import { DetailedUser, User } from '../../api/types';
import { LRUMap } from 'lru_map';
import { RootState } from '../store';
import axios from 'axios';
import { getDetailedUser } from '../../api/users';

const MAX_STORABLE_MODULES = 20;
const MAX_STORABLE_USERS = 100;

export enum DataRetrievalErrorType {
  NONE,
  NO_CONNECTION,
  TIMEOUT,
}

/**
 * Return object whenever getting details from this library.
 */
interface DetailsReturnObject<T> {
  errorType: DataRetrievalErrorType;
  data: T;
}

interface ObjectDetailsState {
  modules: Array<{ key: string; value: User[] }>;
  users: Array<{ key: string; value: DetailedUser }>;
}

let modulesLRU = new LRUMap<string, User[]>(MAX_STORABLE_MODULES);
let usersLRU = new LRUMap<string, DetailedUser>(MAX_STORABLE_USERS);

const initialState: ObjectDetailsState = {
  modules: [],
  users: [],
};

const DetailedObjectSlice = createSlice({
  name: 'objectDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getModuleStudents.fulfilled, (state, action) => {
      if (action.payload.errorType === DataRetrievalErrorType.NONE) {
        modulesLRU.set(action.meta.arg, action.payload.data);
        state.modules = modulesLRU.toJSON();
      }
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      if (action.payload.errorType === DataRetrievalErrorType.NONE) {
        usersLRU.set(action.meta.arg, action.payload.data);
        state.users = usersLRU.toJSON();
      }
    });
  },
});

export const getModuleStudents = createAsyncThunk<
  DetailsReturnObject<User[]>,
  string,
  { state: RootState }
>('objectDetails/getModuleStudents', async (moduleCode, thunkApi) => {
  try {
    const responseData = await getStudentsOfModule(moduleCode);
    return { errorType: DataRetrievalErrorType.NONE, data: responseData };
  } catch (error) {
    modulesLRU = new LRUMap<string, User[]>(
      MAX_STORABLE_MODULES,
      thunkApi
        .getState()
        .objectDetails.modules.map((entry) => [entry.key, entry.value])
    );
    if (!window.navigator.onLine) {
      // not connected to internet, or server not reachable
      if (!modulesLRU.find(moduleCode)) {
        // module info not stored, just throw the error
        throw error;
      }
      // module info stored
      return {
        errorType: DataRetrievalErrorType.NO_CONNECTION,
        data: modulesLRU.get(moduleCode)!,
      };
    }
    if (axios.isAxiosError(error) && !error.response && error.request) {
      // problem reaching server
      if (!modulesLRU.find(moduleCode)) {
        // module info not stored, just throw the error
        throw error;
      }
      return {
        errorType: DataRetrievalErrorType.TIMEOUT,
        data: modulesLRU.get(moduleCode)!,
      };
    }
    throw error;
  }
});

export const getUserDetails = createAsyncThunk<
  DetailsReturnObject<DetailedUser>,
  string,
  { state: RootState }
>('objectDetails/getUserDetails', async (id, thunkApi) => {
  try {
    const responseData = await getDetailedUser(id);
    return { errorType: DataRetrievalErrorType.NONE, data: responseData };
  } catch (error) {
    usersLRU = new LRUMap<string, DetailedUser>(
      MAX_STORABLE_USERS,
      thunkApi
        .getState()
        .objectDetails.users.map((entry) => [entry.key, entry.value])
    );
    if (!window.navigator.onLine) {
      // not connected to internet, or serve not reachable
      if (!usersLRU.find(id)) {
        // module info not stored, just throw the error
        throw error;
      }
      // module info stored
      return {
        errorType: DataRetrievalErrorType.NO_CONNECTION,
        data: usersLRU.get(id)!,
      };
    }
    if (axios.isAxiosError(error) && !error.response && error.request) {
      // problem reaching server
      if (!usersLRU.find(id)) {
        // module info not stored, just throw the error
        throw error;
      }
      return {
        errorType: DataRetrievalErrorType.TIMEOUT,
        data: usersLRU.get(id)!,
      };
    }
    throw error;
  }
});

// set up persistence, uses local storage to persist this reducer
const objectDetailsPersistConfig = {
  key: 'objectDetails',
  storage,
};

const persistedDetailedObjectsStorageReducer = persistReducer(
  objectDetailsPersistConfig,
  DetailedObjectSlice.reducer
);

export default persistedDetailedObjectsStorageReducer;
