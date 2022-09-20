import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { DetailedUser } from '../../api/types';
import { getSelfDetailedUser, updateSelfDetailedUser } from '../../api/users';

const initialUser: DetailedUser = {
  contactDetails: {
    email: '',
    telegramHandle: '',
    phoneNumber: '',
  },
  matriculationYear: '',
  universityCourse: '',
  bio: '',
  id: '',
  name: '',
  connectionStatus: 0,
};

const initialState = {
  user: initialUser,
};

const UserDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<DetailedUser>) => {
      state.user = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.user.name = action.payload;
    },
    setCourse: (state, action: PayloadAction<string>) => {
      state.user.universityCourse = action.payload;
    },
    setBio: (state, action: PayloadAction<string>) => {
      state.user.bio = action.payload;
    },
    setTelegram: (state, action: PayloadAction<string>) => {
      state.user.contactDetails.telegramHandle = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.user.contactDetails.phoneNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateSelfUserDetails.fulfilled, (state, action) => {
      state.user = action.meta.arg;
    });
    builder.addCase(getSelfUserDetails.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const getSelfUserDetails = createAsyncThunk<DetailedUser>(
  'userDetails/getUser',
  async (_, __) => {
    const responseData = await getSelfDetailedUser();
    return responseData;
  }
);

export const updateSelfUserDetails = createAsyncThunk<void, DetailedUser>(
  'userDetails/updateUser',
  async (user, _) => {
    await updateSelfDetailedUser(user);
  }
);

export const {
  setUser,
  setName,
  setCourse,
  setBio,
  setTelegram,
  setPhoneNumber,
} = UserDetailsSlice.actions;

// set up persistence, uses local storage to persist this reducer
const userDetailsPersistConfig = {
  key: 'userDetails',
  storage,
};

const persistedUserDetailsReducer = persistReducer(
  userDetailsPersistConfig,
  UserDetailsSlice.reducer
);

export default persistedUserDetailsReducer;
