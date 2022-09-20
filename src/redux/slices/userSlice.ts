import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { registerUser, UserLoginDetails } from '../../api/authentication';
import { AuthenticationResponse } from '../../pages/authentication/constants';

const initialState = {
  id: '',
  email: '',
  isInProcessOfVerifyingEmail: false,
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
});

export const submitRegisterForm = createAsyncThunk<
  AuthenticationResponse,
  UserLoginDetails
>('user/submitRegisterForm', async (userLoginDetails, thunkApi) => {
  const dispatch = thunkApi.dispatch;
  const responseData = await registerUser(userLoginDetails);
  dispatch(setEmail(userLoginDetails.nus_email));
  return responseData;
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
