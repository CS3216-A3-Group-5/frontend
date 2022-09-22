/**
 * API call handlers for all user specific information.
 */

import axiosInstance from '.';
import {
  ENROLL_MODULE_PATH,
  getPathForGetUserDetails,
  GET_MODULES_OF_STUDENT_PATH,
  OWN_USER_DETAILS_PATH,
  OWN_USER_MODULE_STATUS,
} from './constants';
import {
  responseToDetailedUser,
  detailedUserToResponse,
  DetailedUserResponseFormat,
  ModuleResponseFormat,
  responseToModule,
  userStatusToRequest,
  GetUserStatusResponseFormat,
  responseToUserStatus,
} from './formats';
import { DetailedUser, UniModule, UserStatus } from './types';

/**
 * Returns detailed user object of user with provided userId
 */
export async function getDetailedUser(userId: string): Promise<DetailedUser> {
  const pathForUserDetails = getPathForGetUserDetails(userId);
  const response = await axiosInstance.get<DetailedUserResponseFormat>(
    pathForUserDetails
  );
  return responseToDetailedUser(response.data);
}

/**
 * Returns detailed user object of self
 */
export async function getSelfDetailedUser(): Promise<DetailedUser> {
  const response = await axiosInstance.get<DetailedUserResponseFormat>(
    OWN_USER_DETAILS_PATH
  );
  return responseToDetailedUser(response.data);
}

/**
 * Updates user profile of self
 */
export async function updateSelfDetailedUser(user: DetailedUser) {
  const userResponse = detailedUserToResponse(user);
  const response = await axiosInstance.put<DetailedUserResponseFormat>(
    OWN_USER_DETAILS_PATH,
    userResponse
  );
}

/**
 * Get page of modules user (self) is in
 */
export async function getModulesOfUser(
  page: number,
  keyword?: string
): Promise<UniModule[]> {
  const response = await axiosInstance.get<ModuleResponseFormat[]>(
    GET_MODULES_OF_STUDENT_PATH,
    {
      params: {
        q: keyword,
        page: page,
      },
    }
  );

  const modules = response.data.map((moduleResponse) =>
    responseToModule(moduleResponse)
  );
  return modules;
}

/**
 * Enroll self in a module
 */
export async function enrollModule(moduleCode: string) {
  await axiosInstance.post(ENROLL_MODULE_PATH, {
    module_code: moduleCode,
  });
}

/**
 * Unenroll self from a module
 */
export async function unenrollModule(moduleCode: string) {
  await axiosInstance.delete(ENROLL_MODULE_PATH, {
    data: {
      module_code: moduleCode,
    },
  });
}

/**
 * Get the status of user in a module
 */
export async function getUserStatus(moduleCode: string) {
  const resp = await axiosInstance.get<GetUserStatusResponseFormat>(
    OWN_USER_MODULE_STATUS + '/' + moduleCode
  );
  return responseToUserStatus(resp.data.status);
}

export async function updateUserStatus(
  moduleCode: string,
  newStatus: UserStatus
) {
  await axiosInstance.put(OWN_USER_MODULE_STATUS + '/' + moduleCode, {
    status: userStatusToRequest(newStatus),
  });
}
