import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { registerUser, UserLoginDetails } from '../../api/authentication';

interface UserState {
  id: string;
  email: string;
}

const initialState = {
  id: '',
  email: '',
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
  },
});

export const submitRegisterForm = createAsyncThunk<void, UserLoginDetails>(
  'user/submitRegisterForm',
  async (userLoginDetails, thunkApi) => {
    const dispatch = thunkApi.dispatch;
    await registerUser(userLoginDetails);
    dispatch(setEmail(userLoginDetails.nus_email));
  }
);

export const { setEmail, setId } = UserSlice.actions;

// set up persistence, uses local storage to persist this reducer
const userPersistConfig = {
  key: 'user',
  storage,
};

const persistedUserReducer = persistReducer(
  userPersistConfig,
  UserSlice.reducer
);

export default persistedUserReducer;
