import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getStudentsOfModule } from '../../api/modules';
import { UniModule, User } from '../../api/types';
import { getModulesOfUser } from '../../api/users';

interface HomeState {
  modules: { [key: string]: UniModule }
}

const initialState: HomeState = {
  modules: {}
};

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getModules.fulfilled, (state, action) => {
      const mods: { [key: string]: UniModule } = {};
      for (const module of action.payload) {
        mods[module.code] = module;
      }
      state.modules = mods;
    });
    builder.addCase(updateListOfStudentsInModule.fulfilled, (state, action) => {
      state.modules[action.meta.arg]!.enrolledStudents = action.payload; // module code definitely exist
    })
  },
});

export const getModules = createAsyncThunk<
  Array<UniModule>
>('home/getModules', async () => {
  const responseData = await getModulesOfUser();
  return responseData;
});

export const updateListOfStudentsInModule = createAsyncThunk<Array<User>, string>(
  'home/updateListOfStudentsInModule',
  async (moduleCode: string) => {
    const responseData = await getStudentsOfModule(moduleCode);
    return responseData;
  }
);

// set up persistence, uses local storage to persist this reducer
const homePersistConfig = {
  key: 'home',
  storage
};

const persistedHomeReducer = persistReducer(
  homePersistConfig,
  HomeSlice.reducer
);

export default persistedHomeReducer;
