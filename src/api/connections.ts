/**
 * API call handlers for modules.
 */

import axiosInstance from '.';
import { sampleConnectionData } from './sampleData';
import { Connection, ConnectionType, UniModule } from './types';

export async function getConnections(
  module?: UniModule
): Promise<Connection[]> {
  // Optional module to filter by module
  const response = await axiosInstance.get<Connection[]>('/user/connections', {
    params: {
      connection_type: ConnectionType.CONNECTED,
      module: module,
    },
  });
  // return response.data;
  return [sampleConnectionData[0]];
}

export async function getIncomingConnectionsRequests(
  module?: UniModule
): Promise<Connection[]> {
  // Optional module to filter by module
  const response = await axiosInstance.get<Connection[]>('/user/connections', {
    params: {
      connection_type: ConnectionType.INCOMING_REQUEST,
      module: module,
    },
  });

  return [sampleConnectionData[1]];
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

  return [sampleConnectionData[2]];
}

// export async function acceptIncomingRequest() {

// }

// export async function rejectIncomingRequest() {

// }

// export async function cancelOutgoingRequest() {

// }
