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

const initialConnections: Connection[] = [];
const initialIncoming: Connection[] = [];
const initialOutgoing: Connection[] = [];

const initialState = {
  connections: initialConnections,
  incoming: initialIncoming,
  outgoing: initialOutgoing,
};

const ConnectionsSlice = createSlice({
  name: 'userDetails',
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
      const index = state.incoming.indexOf(action.meta.arg);
      if (index !== -1) {
        state.connections.push(state.incoming[index]);
        state.incoming.splice(index, 1);
      }
    });
    builder.addCase(rejectIncoming.fulfilled, (state, action) => {
      const index = state.incoming.indexOf(action.meta.arg);
      if (index !== -1) {
        state.incoming.splice(index, 1);
      }
    });
    builder.addCase(cancelOutgoing.fulfilled, (state, action) => {
      const index = state.outgoing.indexOf(action.meta.arg);
      if (index !== -1) {
        state.outgoing.splice(index, 1);
      }
    });
    builder.addCase(createConnection.fulfilled, (state, action) => {
      state.outgoing.push(action.payload);
    });
  },
});

export const getConnections = createAsyncThunk<Connection[]>(
  'connections/getConnections',
  async (_, __) => {
    const responseData = await getConnectedConnections();
    return responseData;
  }
);

export const getIncoming = createAsyncThunk<Connection[]>(
  'connections/getIncoming',
  async (_, __) => {
    const responseData = await getIncomingConnectionsRequests();
    return responseData;
  }
);

export const getOutgoing = createAsyncThunk<Connection[]>(
  'connections/getOutgoing',
  async (_, __) => {
    const responseData = await getOutgoingConnectionsRequests();
    return responseData;
  }
);

export const acceptIncoming = createAsyncThunk<void, Connection>(
  'connections/acceptIncoming',
  async (connection, _) => {
    await acceptIncomingRequest(connection);
  }
);

export const rejectIncoming = createAsyncThunk<void, Connection>(
  'connections/rejectIncoming',
  async (connection, _) => {
    await rejectIncomingRequest(connection);
  }
);

export const cancelOutgoing = createAsyncThunk<void, Connection>(
  'connections/cancelOutgoing',
  async (connection, _) => {
    await cancelOutgoingRequest(connection);
  }
);

interface CreateConnectionParameters {
  otherUserId: string;
  module_code: string;
}

export const createConnection = createAsyncThunk<
  Connection,
  CreateConnectionParameters
>('connections/createConnection', async (connection, __) => {
  const response = await createConnectionRequest(
    connection.otherUserId,
    connection.module_code
  );
  return response;
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
