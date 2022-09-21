/**
 * API call handlers for modules.
 */

import axiosInstance from '.';
import { CONNECTIONS_PATH } from './constants';
import { ConnectionResponseFormat, responseToConnection } from './formats';
import { Connection, ConnectionType } from './types';

export async function getConnectedConnections(
  keyword?: string,
  page = 1
): Promise<Connection[]> {
  const response = await axiosInstance.get<ConnectionResponseFormat[]>(
    CONNECTIONS_PATH,
    {
      params: {
        type: ConnectionType.CONNECTED,
        q: keyword ? keyword : '',
        page: { page },
      },
    }
  );
  const connections = response.data.map((response) =>
    responseToConnection(response)
  );
  return connections;
}

export async function getIncomingConnectionsRequests(
  keyword?: string,
  page = 1
): Promise<Connection[]> {
  const response = await axiosInstance.get<ConnectionResponseFormat[]>(
    CONNECTIONS_PATH,
    {
      params: {
        type: ConnectionType.INCOMING_REQUEST,
        q: keyword ? keyword : '',
        page: { page },
      },
    }
  );
  const connections = response.data.map((response) =>
    responseToConnection(response)
  );
  return connections;
}

export async function getOutgoingConnectionsRequests(
  keyword?: string,
  page = 1
): Promise<Connection[]> {
  const response = await axiosInstance.get<ConnectionResponseFormat[]>(
    CONNECTIONS_PATH,
    {
      params: {
        type: ConnectionType.OUTGOING_REQUEST,
        q: keyword ? keyword : '',
        page: { page },
      },
    }
  );
  const connections = response.data.map((response) =>
    responseToConnection(response)
  );
  return connections;
}

export async function acceptIncomingRequest(connection: Connection) {
  await axiosInstance.put(CONNECTIONS_PATH, {
    id: connection.id,
    status: 2,
  });
}

export async function rejectIncomingRequest(connection: Connection) {
  await axiosInstance.put(CONNECTIONS_PATH, {
    id: connection.id,
    status: 0,
  });
}

export async function cancelOutgoingRequest(connection: Connection) {
  await axiosInstance.put(CONNECTIONS_PATH, {
    id: connection.id,
    status: 0,
  });
}

export async function createConnectionRequest(
  otherUserId: string,
  module_code: string
): Promise<Connection> {
  const response = await axiosInstance.post<ConnectionResponseFormat>(
    CONNECTIONS_PATH,
    {
      other_user: Number(otherUserId),
      module_code: module_code,
    }
  );
  return responseToConnection(response.data);
}
