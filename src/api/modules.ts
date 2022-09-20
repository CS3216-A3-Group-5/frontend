/**
 * API call handlers for modules.
 */
import axiosInstance from '.';
import { getPathForGetListOfUsersForModule } from './constants';
import { responseToSimpleUser, SimpleUserResponseFormat } from './formats';

export async function getStudentsOfModule(moduleCode: string) {
  const response = await axiosInstance.get<Array<SimpleUserResponseFormat>>(
    getPathForGetListOfUsersForModule(moduleCode)
  );
  return response.data.map((resp) => responseToSimpleUser(resp));
}
