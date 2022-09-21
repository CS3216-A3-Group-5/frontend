import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  acceptIncomingRequest,
  cancelOutgoingRequest,
  getConnectedConnections,
  getIncomingConnectionsRequests,
  getOutgoingConnectionsRequests,
  rejectIncomingRequest,
} from '../../api/connections';
import { Connection, ConnectionType } from '../../api/types';
import { RootState } from '../store';

interface ConnectionListState {
  connections: { [key: string]: Connection };
  listType: ConnectionType;
  keyword: string;
  page: number;
}

const initialState: ConnectionListState = {
  connections: {},
  listType: ConnectionType.CONNECTED,
  keyword: '',
  page: 1,
};

const ConnectionListSlice = createSlice({
  name: 'connectionList',
  initialState,
  reducers: {
    setListType: (state, action: PayloadAction<ConnectionType>) => {
      state.listType = action.payload;
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetConnections: (state, action: PayloadAction<void>) => {
      state.connections = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNewPageOfConnections.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        // only if a non empty page received then increment page
        state.page += 1;
        const newConnections = Object.create(state.connections) as {
          [key: string]: Connection;
        };
        for (const connection of action.payload) {
          newConnections[connection.id] = connection;
        }
        state.connections = newConnections;
      }
    });
    builder.addCase(
      getPageOfConnectionsWithNewKeyword.fulfilled,
      (state, action) => {
        const newConnections: { [key: string]: Connection } = {};
        for (const connection of action.payload) {
          newConnections[connection.id] = connection;
        }
        state.connections = newConnections;
      }
    );
    builder.addCase(acceptIncomingInList.fulfilled, (state, action) => {
      const newConnections = { ...state.connections };
      delete newConnections[action.meta.arg.id];
      state.connections = newConnections;
    });
    builder.addCase(rejectIncomingInList.fulfilled, (state, action) => {
      const newConnections = { ...state.connections };
      delete newConnections[action.meta.arg.id];
      state.connections = newConnections;
    });
    builder.addCase(cancelOutgoingInList.fulfilled, (state, action) => {
      const newConnections = { ...state.connections };
      delete newConnections[action.meta.arg.id];
      state.connections = newConnections;
    });
  },
});

async function getConnectionsOfType(
  type: ConnectionType,
  keyword?: string,
  page = 1
): Promise<Connection[]> {
  if (type == ConnectionType.CONNECTED) {
    return await getConnectedConnections(keyword, page);
  } else if (type == ConnectionType.INCOMING_REQUEST) {
    return await getIncomingConnectionsRequests(keyword, page);
  } else {
    return await getOutgoingConnectionsRequests(keyword, page);
  }
}

export const getPageOfConnectionsWithNewKeyword = createAsyncThunk<
  Array<Connection>,
  string | undefined,
  { state: RootState }
>(
  'connectionList/getPageOfConnectionsWithNewKeyword',
  async (keyword, thunkApi) => {
    thunkApi.dispatch(
      ConnectionListSlice.actions.setKeyword(keyword ? keyword : '')
    );
    thunkApi.dispatch(ConnectionListSlice.actions.setPage(1));
    const responseData = await getConnectionsOfType(
      thunkApi.getState().connectionList.listType,
      keyword,
      1
    );
    return responseData;
  }
);

export const getNewPageOfConnections = createAsyncThunk<
  Array<Connection>,
  undefined,
  { state: RootState }
>('connectionList/getNewPageOfConnections', async (_, thunkApi) => {
  const keyword = thunkApi.getState().connectionList.keyword;
  const page = thunkApi.getState().connectionList.page;
  const responseData = await getConnectionsOfType(
    thunkApi.getState().connectionList.listType,
    keyword,
    page
  );
  return responseData;
});

export const acceptIncomingInList = createAsyncThunk<void, Connection>(
  'connectionList/acceptIncomingInList',
  async (connection, _) => {
    await acceptIncomingRequest(connection);
  }
);

export const rejectIncomingInList = createAsyncThunk<void, Connection>(
  'connectionList/rejectIncomingInList',
  async (connection, _) => {
    await rejectIncomingRequest(connection);
  }
);

export const cancelOutgoingInList = createAsyncThunk<void, Connection>(
  'connectionList/cancelOutgoingInList',
  async (connection, _) => {
    await cancelOutgoingRequest(connection);
  }
);

export const { setListType, resetConnections } = ConnectionListSlice.actions;

export default ConnectionListSlice.reducer;
