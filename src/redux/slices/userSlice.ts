import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { registerUser, UserLoginDetails } from '../../api/authentication';
import { UserStatus } from '../../api/types';
import { getUserStatus, updateUserStatus } from '../../api/users';
import { AuthenticationResponse } from '../../pages/authentication/constants';

interface UserState {
  id: string;
  email: string;
  isInProcessOfVerifyingEmail: boolean;
  moduleStatuses: { [key: string]: UserStatus };
}

const initialState: UserState = {
  id: '',
  email: '',
  isInProcessOfVerifyingEmail: false,
  moduleStatuses: {},
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setIsInProcessOfVerifyingEmail: (state, action: PayloadAction<boolean>) => {
      state.isInProcessOfVerifyingEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* eslint-disable */
    builder.addCase(getUserStatusForModule.fulfilled, (state, action) => {
      const updatedModuleStatuses = Object.create(state.moduleStatuses);
      updatedModuleStatuses[action.meta.arg] = action.payload;
      state.moduleStatuses = updatedModuleStatuses;
    });
    builder.addCase(updateUserStatusForModule.fulfilled, (state, action) => {
      const updatedModuleStatuses = Object.create(state.moduleStatuses);
      updatedModuleStatuses[action.meta.arg.moduleCode] =
        action.meta.arg.newStatus;
      state.moduleStatuses = updatedModuleStatuses;
    });
    builder.addCase(submitRegisterForm.fulfilled, (state, action) => {
      state.email = action.meta.arg.nus_email;
    });
  },
});

export const submitRegisterForm = createAsyncThunk<
  AuthenticationResponse,
  UserLoginDetails
>('user/submitRegisterForm', async (userLoginDetails, thunkApi) => {
  const dispatch = thunkApi.dispatch;
  try {
    const responseData = await registerUser(userLoginDetails);
    return responseData;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const getUserStatusForModule = createAsyncThunk<UserStatus, string>(
  'user/getUserStatusForModule',
  async (moduleCode, thunkApi) => {
    try {
      const data = await getUserStatus(moduleCode);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateUserStatusForModule = createAsyncThunk<
  void,
  { moduleCode: string; newStatus: UserStatus }
>('user/updateUserStatusForModule', async (args, thunkApi) => {
  try {
    const data = await updateUserStatus(args.moduleCode, args.newStatus);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const { setEmail, setId, setIsInProcessOfVerifyingEmail } =
  UserSlice.actions;

// set up persistence, uses local storage to persist this reducer
const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['isInProcessOfVerifyingEmail'],
};

const persistedUserReducer = persistReducer(
  userPersistConfig,
  UserSlice.reducer
);

export default persistedUserReducer;
