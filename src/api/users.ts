/**
 * API call handlers for users.
 */

import axiosInstance from '.';
import { ConnectionStatus, DetailedUser } from './types';

interface SimpleUserResponseFormat {
  id: number;
  name: string;
  thumbnail_pic: string | undefined;
  user_status: UserStatusResponse | undefined;
  connection_status: ConnectionStatus | undefined;
}

interface DetailedUserResponseFormat {
  id: number;
  name: string;
  nus_email: string;
  telegram_id: string | undefined;
  phone_number: string | undefined;
  year: number;
  major: string;
  bio: string;
  profile_pic: string | undefined;
  user_status: UserStatusResponse | undefined;
  connection_status: ConnectionStatus | undefined;
}

enum UserStatusResponse {
  NO_STATUS = 0,
  LOOKING_FOR_A_FRIEND = 1,
  WILLING_TO_HELP = 2,
}

/**
 * Returns detailed user object of self
 */
export async function getSelfUser(): Promise<DetailedUser> {
  const response = await axiosInstance.get<DetailedUserResponseFormat>('/user');
  console.log(response.data);
  const newUser: DetailedUser = {
    contactDetails: {
      email: response.data.nus_email,
      telegramHandle: response.data.telegram_id,
      phoneNumber: response.data.phone_number,
    },
    matriculationYear: String(response.data.year),
    universityCourse: response.data.major,
    bio: response.data.bio,
    id: String(response.data.id),
    name: response.data.name,
    connectionStatus: 0,
  };
  console.log(newUser);
  return newUser;
}

/**
 * Updates user profile of self
 */
export async function updateSelfUser(user: DetailedUser) {
  const userResponse: DetailedUserResponseFormat = {
    id: Number(user.id),
    name: user.name,
    nus_email: user.contactDetails.email,
    telegram_id: user.contactDetails.telegramHandle,
    phone_number: user.contactDetails.phoneNumber,
    year: Number(user.matriculationYear),
    major: user.universityCourse,
    bio: user.bio,
    profile_pic: user.profilePic,
    user_status: undefined,
    connection_status: undefined,
  };
  const response = await axiosInstance.put<DetailedUserResponseFormat>(
    '/user',
    userResponse
  );
  console.log(response);
}
