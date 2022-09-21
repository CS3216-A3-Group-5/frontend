import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  acceptIncomingRequest,
  cancelOutgoingRequest,
  createConnectionRequest,
  getConnectedConnections,
  getIncomingConnectionsRequests,
  getOutgoingConnectionsRequests,
  rejectIncomingRequest,
} from '../../api/connections';
import { Connection } from '../../api/types';

interface ConnectionState {
  connections: Connection[];
  incoming: Connection[];
  outgoing: Connection[];
}
const initialState: ConnectionState = {
  connections: [],
  incoming: [],
  outgoing: [],
};

const ConnectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getConnections.fulfilled, (state, action) => {
      state.connections = action.payload;
    });
    builder.addCase(getIncoming.fulfilled, (state, action) => {
      state.incoming = action.payload;
    });
    builder.addCase(getOutgoing.fulfilled, (state, action) => {
      state.outgoing = action.payload;
    });
    builder.addCase(acceptIncoming.fulfilled, (state, action) => {
      state.connections.push(action.meta.arg);
      state.incoming = state.incoming.filter(
        ({ id }) => id !== action.meta.arg.id
      );
    });
    builder.addCase(rejectIncoming.fulfilled, (state, action) => {
      state.incoming = state.incoming.filter(
        ({ id }) => id !== action.meta.arg.id
      );
    });
    builder.addCase(cancelOutgoing.fulfilled, (state, action) => {
      state.outgoing = state.outgoing.filter(
        ({ id }) => id !== action.meta.arg.id
      );
    });
    builder.addCase(createConnection.fulfilled, (state, action) => {
      state.outgoing.push(action.payload);
    });
  },
});

export const getConnections = createAsyncThunk<Connection[]>(
  'connections/getConnections',
  async (_, thunkApi) => {
    try {
      const responseData = await getConnectedConnections();
      return responseData;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getIncoming = createAsyncThunk<Connection[]>(
  'connections/getIncoming',
  async (_, thunkApi) => {
    try {
      const responseData = await getIncomingConnectionsRequests();
      return responseData;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getOutgoing = createAsyncThunk<Connection[]>(
  'connections/getOutgoing',
  async (_, thunkApi) => {
    try {
      const responseData = await getOutgoingConnectionsRequests();
      return responseData;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const acceptIncoming = createAsyncThunk<void, Connection>(
  'connections/acceptIncoming',
  async (connection, thunkApi) => {
    try {
      await acceptIncomingRequest(connection);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const rejectIncoming = createAsyncThunk<void, Connection>(
  'connections/rejectIncoming',
  async (connection, thunkApi) => {
    try {
      await rejectIncomingRequest(connection);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const cancelOutgoing = createAsyncThunk<void, Connection>(
  'connections/cancelOutgoing',
  async (connection, thunkApi) => {
    try {
      await cancelOutgoingRequest(connection);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

interface CreateConnectionParameters {
  otherUserId: string;
  module_code: string;
}

export const createConnection = createAsyncThunk<
  Connection,
  CreateConnectionParameters
>('connections/createConnection', async (connection, thunkApi) => {
  try {
    const response = await createConnectionRequest(
      connection.otherUserId,
      connection.module_code
    );
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const connectionsPersistConfig = {
  key: 'connections',
  storage,
};

const persistedConnectionsReducer = persistReducer(
  connectionsPersistConfig,
  ConnectionsSlice.reducer
);

export default persistedConnectionsReducer;
