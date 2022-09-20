/**
 * Converting api call responses into project-specific types
 */
import {
  Connection,
  ConnectionStatus,
  DetailedUser,
  UniModule,
  User,
  UserStatus,
} from './types';

enum UserStatusResponse {
  NO_STATUS = 0,
  LOOKING_FOR_A_FRIEND = 1,
  WILLING_TO_HELP = 2,
}

export interface SimpleUserResponseFormat {
  id: number;
  name: string;
  thumbnail_pic: string;
  connection_status: ConnectionStatus;
  user_status: UserStatusResponse;
}

export interface DetailedUserResponseFormat {
  id: number;
  name: string;
  profile_pic: string;
  nus_email: string;
  telegram_id: string;
  phone_number: string;
  year: number;
  major: string;
  bio: string;
  connection_status: ConnectionStatus;
}

export interface ConnectionResponseFormat {
  id: number;
  other_user: SimpleUserResponseFormat;
  module: ModuleResponseFormat;
}

export interface ModuleResponseFormat {
  title: string;
  module_code: string;
}

export function responseToSimpleUser(data: SimpleUserResponseFormat): User {
  const newUser: User = {
    id: String(data.id),
    name: data.name,
    thumbnailPic: data.thumbnail_pic,
    connectionStatus: data.connection_status,
    userStatus: responseToUserStatus(data.user_status),
  };
  return newUser;
}

export function simpleUserToResponse(user: User): SimpleUserResponseFormat {
  const response: SimpleUserResponseFormat = {
    id: Number(user.id),
    name: user.name,
    thumbnail_pic: user.thumbnailPic ? user.thumbnailPic : '',
    user_status: userStatusToResponse(user.userStatus),
    connection_status: user.connectionStatus,
  };
  return response;
}

export function responseToDetailedUser(
  data: DetailedUserResponseFormat
): DetailedUser {
  const newUser: DetailedUser = {
    contactDetails: {
      email: data.nus_email,
      telegramHandle: data.telegram_id,
      phoneNumber: data.phone_number,
    },
    matriculationYear: String(data.year),
    universityCourse: data.major,
    bio: data.bio,
    profilePic: data.profile_pic,
    id: String(data.id),
    name: data.name,
    connectionStatus: data.connection_status,
  };
  return newUser;
}

export function detailedUserToResponse(
  user: DetailedUser
): DetailedUserResponseFormat {
  const userResponse: DetailedUserResponseFormat = {
    id: Number(user.id),
    name: user.name,
    nus_email: user.contactDetails.email,
    telegram_id: user.contactDetails.telegramHandle
      ? user.contactDetails.telegramHandle
      : '',
    phone_number: user.contactDetails.phoneNumber
      ? user.contactDetails.phoneNumber
      : '',
    year: Number(user.matriculationYear),
    major: user.universityCourse,
    bio: user.bio,
    profile_pic: user.profilePic ? user.profilePic : '',
    connection_status: user.connectionStatus,
  };
  return userResponse;
}

export function responseToConnection(
  data: ConnectionResponseFormat
): Connection {
  const newUser: User = responseToSimpleUser(data.other_user);
  const newModule: UniModule = responseToModule(data.module);
  const newConnection: Connection = {
    id: '',
    otherUser: newUser,
    uniModule: newModule,
  };
  return newConnection;
}

export function connectionToResponse(
  connection: Connection
): ConnectionResponseFormat {
  const userResponse = simpleUserToResponse(connection.otherUser);
  const moduleResponse = moduleToResponse(connection.uniModule);
  const response: ConnectionResponseFormat = {
    id: Number(connection.id),
    other_user: userResponse,
    module: moduleResponse,
  };
  return response;
}

export function responseToModule(data: ModuleResponseFormat): UniModule {
  const newModule: UniModule = {
    code: data.module_code,
    name: data.title,
  };
  return newModule;
}

export function moduleToResponse(module: UniModule): ModuleResponseFormat {
  const moduleResponse: ModuleResponseFormat = {
    title: module.name,
    module_code: module.code,
  };
  return moduleResponse;
}

export function responseToUserStatus(
  data: UserStatusResponse
): UserStatus | undefined {
  if (data == UserStatusResponse.NO_STATUS) {
    return undefined;
  } else if (data == UserStatusResponse.LOOKING_FOR_A_FRIEND) {
    return UserStatus.LOOKING_FOR_A_FRIEND;
  } else {
    return UserStatus.WILLING_TO_HELP;
  }
}

export function userStatusToResponse(
  userStatus: UserStatus | undefined
): UserStatusResponse {
  if (userStatus == undefined) {
    return UserStatusResponse.NO_STATUS;
  } else if (userStatus == UserStatus.LOOKING_FOR_A_FRIEND) {
    return UserStatusResponse.LOOKING_FOR_A_FRIEND;
  } else {
    return UserStatusResponse.WILLING_TO_HELP;
  }
}
