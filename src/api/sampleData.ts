/**
 * TODO: Remove when API is ready
 * This is sample data to be able to see UI layout.
 */

import { ConnectionStatus, UniModule, User, UserStatus } from './types';

export const sampleUsers: Array<User> = [
  {
    id: '0',
    name: 'Ben',
    connectionStatus: ConnectionStatus.CONNECTED,
    userStatus: UserStatus.LOOKING_FOR_A_FRIEND,
  },
  {
    id: '1',
    name: 'Tom',
    connectionStatus: ConnectionStatus.PENDING,
    userStatus: UserStatus.WILLING_TO_HELP,
  },
  {
    id: '2',
    name: 'John',
    connectionStatus: ConnectionStatus.NOT_CONNECTED,
    userStatus: UserStatus.LOOKING_FOR_A_FRIEND,
  },
];

export const sampleModuleData: Array<UniModule> = [
  {
    code: 'CS3216',
    name: 'Software Engineering for Digital Markets',
    enrolledStudents: sampleUsers,
  },
  {
    code: 'CS3210',
    name: 'Parallel Computing',
    enrolledStudents: sampleUsers,
  },
  {
    code: 'CS2109S',
    name: 'Introduction to Parallel Computing',
    enrolledStudents: sampleUsers,
  },
];
