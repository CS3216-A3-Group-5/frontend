/**
 * API call handlers for modules.
 */
import axiosInstance from '.';
import {
  getPathForGetListOfUsersForModule,
  GET_LIST_OF_MODULES_PATH,
} from './constants';
import {
  ModuleResponseFormat,
  responseToModule,
  responseToSimpleUser,
  SimpleUserResponseFormat,
} from './formats';
import { UniModule } from './types';

export async function getStudentsOfModule(moduleCode: string) {
  const response = await axiosInstance.get<Array<SimpleUserResponseFormat>>(
    getPathForGetListOfUsersForModule(moduleCode)
  );
  return response.data.map((resp) => responseToSimpleUser(resp));
}

/**
 * Get a page of modules to explore.
 */
export async function getExploreModulesFromApi(
  page: number,
  search_term?: string
): Promise<UniModule[]> {
  const response = await axiosInstance.get<ModuleResponseFormat[]>(
    GET_LIST_OF_MODULES_PATH,
    {
      params: {
        q: search_term,
        page: page,
      },
    }
  );

  const modules = response.data.map((moduleResponse) =>
    responseToModule(moduleResponse)
  );
  return modules;
}
