/**
 * API call handlers for modules.
 */
import axiosInstance from '.';
import { getPathForGetListOfUsersForModule } from './constants';
import { User } from './types';


export async function getStudentsOfModule(moduleCode: string) {
  const response = await axiosInstance.get<Array<User>>(getPathForGetListOfUsersForModule(moduleCode));
  return response.data;
}