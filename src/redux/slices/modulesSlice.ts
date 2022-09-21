import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logEvent } from 'firebase/analytics';
import { getExploreModulesFromApi } from '../../api/modules';
import { UniModule } from '../../api/types';
import { analytics } from '../../firebase';
import { RootState } from '../store';

interface ModuleState {
  modules: { [key: string]: UniModule };
  keyword: string;
  page: number;
}

const initialState: ModuleState = {
  modules: {},
  keyword: '',
  page: 1, // data until and including this page number are stored in the redux store
};

const ModuleSlice = createSlice({
  name: 'module',
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
    /*
    builder.addCase(
      updateListOfStudentsInExploreModule.fulfilled,
      (state, action) => {
        state.modules[action.meta.arg]!.enrolledStudents = action.payload; // module code definitely exist
      }
    ); */
    builder.addCase(getNewPageOfExploreModules.fulfilled, (state, action) => {
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
      getPageOfExploreModulesWithNewKeyword.fulfilled,
      (state, action) => {
        const mods: { [key: string]: UniModule } = {};
        for (const module of action.payload) {
          mods[module.code] = module;
        }
        state.modules = mods;
        if (action.meta.arg) {
          logEvent(analytics, 'search', {
            search_term: action.meta.arg,
          });
        }
      }
    );
  },
});

export const getNewPageOfExploreModules = createAsyncThunk<
  Array<UniModule>,
  undefined,
  { state: RootState }
>('modules/getNewPageOfExploreModules', async (_, thunkApi) => {
  const keyword = thunkApi.getState().modules.keyword;
  const page = thunkApi.getState().modules.page;
  try {
    const responseData = await getExploreModulesFromApi(page + 1, keyword);
    return responseData;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const getPageOfExploreModulesWithNewKeyword = createAsyncThunk<
  Array<UniModule>,
  string | undefined | null,
  { state: RootState }
>(
  'modules/getPageOfExploreModulesWithNewKeyword',
  async (keyword, thunkApi) => {
    thunkApi.dispatch(ModuleSlice.actions.setKeyword(keyword ? keyword : ''));
    thunkApi.dispatch(ModuleSlice.actions.setPage(1));
    try {
      const responseData = await getExploreModulesFromApi(
        1,
        keyword ? keyword : ''
      );
      return responseData;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

/*
export const updateListOfStudentsInExploreModule = createAsyncThunk<
  Array<User>,
  string
>('modules/updateListOfStudentsInModule', async (moduleCode: string) => {
  const responseData = await getStudentsOfModule(moduleCode);
  return responseData;
});
*/

export default ModuleSlice.reducer;
