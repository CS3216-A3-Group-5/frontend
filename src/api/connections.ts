/**
 * API call handlers for modules.
 */

import axiosInstance from '.';
import { Connection, ConnectionType, UniModule } from './types';

export async function getConnections(
  module?: UniModule
): Promise<Connection[]> {
  // Optional module to filter by module
  const response = await axiosInstance.get<Connection[]>('/user/connections', {
    params: {
      connection_status: ConnectionType.CONNECTED,
      module: module,
    },
  });
  return response.data;
  // return [sampleConnectionData[0]];
}

export async function getIncomingConnectionsRequests(
  module?: UniModule
): Promise<Connection[]> {
  // Optional module to filter by module
  const response = await axiosInstance.get<Connection[]>('/user/connections', {
    params: {
      connection_status: ConnectionType.INCOMING_REQUEST,
      module: module,
    },
  });
  return response.data;
  // return [sampleConnectionData[1]];
}

export async function getOutgoingConnectionsRequests(
  module?: UniModule
): Promise<Connection[]> {
  // Optional module to filter by module
  const response = await axiosInstance.get<Connection[]>('/user/connections', {
    params: {
      connection_type: ConnectionType.OUTGOING_REQUEST,
      module: module,
    },
  });
  return response.data;
  // return [sampleConnectionData[2]];
}

export async function acceptIncomingRequest(
  id: string,
  connection: Connection
) {
  const response = await axiosInstance.put<Connection[]>('/user/connections', {
    params: {
      requester: connection.otherUser,
      accepter: id,
      module_code: connection.uniModule.code,
      connection_status: 1,
    },
  });
}

export async function rejectIncomingRequest(
  id: string,
  connection: Connection
) {
  await axiosInstance.put<Connection[]>('/user/connections', {
    params: {
      requester: connection.otherUser,
      accepter: id,
      module_code: connection.uniModule.code,
      connection_status: 1,
    },
  });
}

export async function cancelOutgoingRequest(
  id: string,
  connection: Connection
) {
  await axiosInstance.put<Connection[]>('/user/connections', {
    params: {
      requester: id,
      accepter: connection.otherUser,
      module_code: connection.uniModule.code,
      connection_status: 1,
    },
  });
}

export async function createConnectionRequest(
  otherUserId: string,
  module_code: string
) {
  await axiosInstance.put<Connection[]>('/user/connections', {
    params: {
      accepter: otherUserId,
      module_code: module_code,
    },
  });
}
