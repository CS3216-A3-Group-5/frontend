/**
 * TODO: Remove when API is ready
 * This is sample data to be able to see UI layout.
 */

import {
  Connection,
  ConnectionStatus,
  DetailedUser,
  UniModule,
  User,
  UserStatus,
} from './types';

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

export const sampleConnectionData: Array<Connection> = [
  {
    id: '0',
    otherUser: sampleUsers[0],
    uniModule: sampleModuleData[0],
  },
  {
    id: '1',
    otherUser: sampleUsers[1],
    uniModule: sampleModuleData[1],
  },
  {
    id: '2',
    otherUser: sampleUsers[2],
    uniModule: sampleModuleData[2],
  },
];

export const sampleDetailedUser: DetailedUser = {
  contactDetails: {
    email: 'bob@u.nus.edu',
    telegramHandle: '@bobbybob',
    phoneNumber: '91234567',
  },
  matriculationYear: '2022',
  universityCourse: 'Computer Science',
  bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  id: '3',
  name: 'Bob',
  connectionStatus: ConnectionStatus.NOT_CONNECTED,
};
