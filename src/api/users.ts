/**
 * API call handlers for all user specific information.
 */

import { _ActionCreatorWithPreparedPayload } from '@reduxjs/toolkit/dist/createAction';
import { responseEncoding } from 'axios';
import axiosInstance from '.';
import {
  getPathForGetUserDetails,
  GET_MODULES_OF_STUDENT_PATH,
  OWN_USER_DETAILS_PATH,
} from './constants';
import { DetailedUser, UniModule } from './types';

/**
 * Returns detailed user object of self
 */
export async function getSelfUser(): Promise<DetailedUser> {
  const response = await axiosInstance.get<DetailedUser>(OWN_USER_DETAILS_PATH);
  return response.data;
}

/**
 * Updates user profile of self
 */
export async function updateSelfUser(user: DetailedUser) {
  const response = await axiosInstance.put<DetailedUser>(
    OWN_USER_DETAILS_PATH,
    user
  );
  //TODO: remove console.log
  console.log(response);
}

export async function getUser(id: string) {
  const response = await axiosInstance.get<DetailedUser>(
    getPathForGetUserDetails(id)
  );
  //TODO: change when the converter done
  return {
    id: 3,
    name: 'Timmy Tan',

    contactDetails: {
      telegramHandle: 'timmytim',
      phoneNumber: '91234567',
      email: 'timmy@u.nus.edu',
    },

    matriculationYear: 2022,
    universityCourse: 'Computer Science',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    userStatus: 0,
    connectionStatus: 0,
  };
  //return response.data;
}

/**
 * Returns list of modules that a student is in.
 */
export async function getModulesOfUser() {
  const response = await axiosInstance.get<
    Array<{ title: string; module_code: string; is_enrolled: boolean }>
  >(GET_MODULES_OF_STUDENT_PATH);
  return response.data.map(
    (module) =>
      ({
        code: module.module_code,
        name: module.title,
        isEnrolled: module.is_enrolled,
      } as UniModule)
  );
}
