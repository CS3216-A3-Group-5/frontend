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
  year: number;
  major: string;
}

export interface DetailedUserResponseFormat {
  id: number;
  name: string;
  thumbnail_pic: string;
  connection_status: ConnectionStatus;
  profile_pic: string;
  nus_email: string;
  telegram_id: string;
  phone_number: string;
  bio: string;
  year: number;
  major: string;
}

interface DetailedUserPostRequestDataFormat {
  id: number;
  name: string;
  connection_status: ConnectionStatus;
  year: number;
  major: string;
  nus_email: string;
  telegram_id: string;
  phone_number: string;
  bio: string;
}

export interface ConnectionResponseFormat {
  id: number;
  other_user: SimpleUserResponseFormat;
  module: ModuleResponseFormat;
}

export interface ModuleResponseFormat {
  title: string;
  module_code: string;
  is_enrolled: boolean;
}

export interface GetUserStatusResponseFormat {
  status: UserStatusResponse;
}

export function responseToSimpleUser(data: SimpleUserResponseFormat): User {
  const newUser: User = {
    id: String(data.id),
    name: data.name,
    thumbnailPic: data.thumbnail_pic,
    connectionStatus: data.connection_status,
    userStatus: responseToUserStatus(data.user_status),
    matriculationYear: String(data.year),
    universityCourse: data.major,
  };
  return newUser;
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
): DetailedUserPostRequestDataFormat {
  const userRequestData: DetailedUserPostRequestDataFormat = {
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
    connection_status: user.connectionStatus,
  };
  return userRequestData;
}

export function responseToConnection(
  data: ConnectionResponseFormat
): Connection {
  const newUser: User = responseToSimpleUser(data.other_user);
  const newModule: UniModule = responseToModule(data.module);
  const newConnection: Connection = {
    id: String(data.id),
    otherUser: newUser,
    uniModule: newModule,
  };
  return newConnection;
}

export function responseToModule(data: ModuleResponseFormat): UniModule {
  const newModule: UniModule = {
    code: data.module_code,
    name: data.title,
    isEnrolled: data.is_enrolled,
  };
  return newModule;
}

export function responseToUserStatus(data: UserStatusResponse): UserStatus {
  if (data === UserStatusResponse.NO_STATUS) {
    return UserStatus.NO_STATUS;
  } else if (data === UserStatusResponse.LOOKING_FOR_A_FRIEND) {
    return UserStatus.LOOKING_FOR_A_FRIEND;
  } else {
    return UserStatus.WILLING_TO_HELP;
  }
}

export function userStatusToRequest(status: UserStatus) {
  switch (status) {
    case UserStatus.LOOKING_FOR_A_FRIEND:
      return 1;
    case UserStatus.WILLING_TO_HELP:
      return 2;
    default:
      return 0;
  }
}
