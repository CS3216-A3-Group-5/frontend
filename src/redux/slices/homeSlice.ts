import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getStudentsOfModule } from '../../api/modules';
import { UniModule, User } from '../../api/types';
import { getModulesOfUser } from '../../api/users';
import { RootState } from '../store';

interface HomeState {
  modules: { [key: string]: UniModule };
  keyword: string;
  page: number;
}

const initialState: HomeState = {
  modules: {},
  keyword: '',
  page: 1, // pages up to and including this page shown in the list to user
};

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateListOfStudentsInModule.fulfilled, (state, action) => {
      state.modules[action.meta.arg]!.enrolledStudents = action.payload; // module code definitely exist
    });
    builder.addCase(getNewPageOfModules.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        // only if a non empty page received then increment page
        state.page += 1;
        const mods = Object.create(state.modules) as {
          [key: string]: UniModule;
        };
        for (const module of action.payload) {
          mods[module.code] = module;
        }
        state.modules = mods;
      }
    });
    builder.addCase(
      getPageOfModulesWithNewKeyword.fulfilled,
      (state, action) => {
        const mods: { [key: string]: UniModule } = {};
        for (const module of action.payload) {
          mods[module.code] = module;
        }
        state.modules = mods;
      }
    );
  },
});

export const getNewPageOfModules = createAsyncThunk<
  Array<UniModule>,
  undefined,
  { state: RootState }
>('home/getNewPageOfModules', async (_, thunkApi) => {
  const keyword = thunkApi.getState().home.keyword;
  const page = thunkApi.getState().home.page;
  try {
    const responseData = await getModulesOfUser(page + 1, keyword);
    return responseData;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const getPageOfModulesWithNewKeyword = createAsyncThunk<
  Array<UniModule>,
  string | undefined | null,
  { state: RootState }
>('home/getPageOfModulesWithNewKeyword', async (keyword, thunkApi) => {
  thunkApi.dispatch(HomeSlice.actions.setKeyword(keyword ? keyword : ''));
  thunkApi.dispatch(HomeSlice.actions.setPage(1));
  try {
    const responseData = await getModulesOfUser(1, keyword ? keyword : '');
    return responseData;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const updateListOfStudentsInModule = createAsyncThunk<
  Array<User>,
  string
>('home/updateListOfStudentsInModule', async (moduleCode: string, thunkApi) => {
  try {
    const responseData = await getStudentsOfModule(moduleCode);
    return responseData;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// set up persistence, uses local storage to persist this reducer
const homePersistConfig = {
  key: 'home',
  storage,
};

const persistedHomeReducer = persistReducer(
  homePersistConfig,
  HomeSlice.reducer
);

export default persistedHomeReducer;
