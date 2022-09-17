/**
 * API call handlers for users.
 */

import axiosInstance from '.';
import { DetailedUser } from './types';

/**
 * Returns detailed user object of self
 */
export async function getSelfUser(): Promise<DetailedUser> {
  const response = await axiosInstance.get<DetailedUser>('/user');
  return response.data;
}

/**
 * Updates user profile of self
 */
export async function updateSelfUser(user: DetailedUser) {
  await axiosInstance.put<DetailedUser>('/user', user);
}
