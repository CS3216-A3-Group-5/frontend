import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { DetailedUser } from "../../api/types";
import { getSelfUser, updateSelfUser } from "../../api/users";

const initialUser: DetailedUser = {
  contact_details: {
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
}


const initialState = {
  user: initialUser
}

const UserDetailsSlice = createSlice ({
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
      state.user.contact_details.telegramHandle = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.user.contact_details.phoneNumber = action.payload;
    },
  },
})

export const getSelfUserDetails = createAsyncThunk<DetailedUser>(
  'userDetails/getUser',
  async (_, thunkApi) => {
    const dispatch = thunkApi.dispatch;
    const responseData = await getSelfUser();
    dispatch(setUser(responseData));
    return responseData;
  }
);

export const updateSelfUserDetails = createAsyncThunk<void, DetailedUser>(
  'userDetails/updateUser',
  async (user, _) => {
    await updateSelfUser(user);
  }
);

export const { setUser, setName, setCourse, setBio, setTelegram, setPhoneNumber } = UserDetailsSlice.actions

// set up persistence, uses local storage to persist this reducer
const userPersistConfig = {
  key: 'userDetails',
  storage,
};

const persistedUserDetailsReducer = persistReducer(
  userPersistConfig,
  UserDetailsSlice.reducer
);

export default persistedUserDetailsReducer;